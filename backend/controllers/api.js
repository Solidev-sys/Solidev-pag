const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const sesiones = require('../js/Sesiones/service');
const productos = require('../js/Productos/service');
const carrito = require('../js/Carrito/service');
const categorias = require('../js/Categorias/service');
const { Categoria } = require('../js/Models');
const historial = require('../js/Historial/service');
const descuentos = require('../js/Descuentos/service');
const https = require('https');
const fs = require('fs');

const { title } = require('process');
const nTunel = "548200159a34";
const app = express();
const PORT = process.env.PORT || 3001;
const HTTP_PORT = process.env.HTTP_PORT || 3002; // Agregar puerto HTTP

// === Sesiones y CORS ===
const session = require('express-session');
let RedisStore, createClient;
try {
    RedisStore = require('connect-redis').default;
    ({ createClient } = require('redis'));
} catch (e) {
    // En desarrollo puede no estar instalado Redis, se usará MemoryStore
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET; // Debe estar definido en .env
if (!SESSION_SECRET) {
    console.warn('ADVERTENCIA: Falta SESSION_SECRET en variables de entorno. Define uno seguro en .env');
}

if (NODE_ENV === 'production') {
    app.set('trust proxy', 1); // necesario si estás detrás de un proxy o en plataformas como Heroku/Render
}

// Configuración de CORS con credenciales y orígenes permitidos
// Configuración de CORS mejorada
const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:3000', 
    'http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:3002',
    'https://localhost:3002'
];

// Si hay CORS_ORIGINS en .env, agregarlos también
if (process.env.CORS_ORIGINS) {
    const envOrigins = process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
    allowedOrigins.push(...envOrigins);
}

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (Postman, aplicaciones móviles, etc.)
        if (!origin) return callback(null, true);
        
        // En desarrollo, permitir cualquier localhost
        if (NODE_ENV !== 'production' && origin && origin.includes('localhost')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        console.log(`❌ CORS bloqueado para origen: ${origin}`);
        return callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Body parser
app.use(express.json());

// Habilitar CORS ANTES de las rutas
app.use(cors(corsOptions));

// Configurar Redis store en producción si REDIS_URL está disponible
let sessionStore;
if (NODE_ENV === 'production' && RedisStore && process.env.REDIS_URL) {
    const redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis error', err));
    redisClient.connect().catch(err => console.error('Redis connect error', err));
    sessionStore = new RedisStore({ client: redisClient, prefix: 'sess:' });
}

// Definir sameSite y secure según entorno o envs
const cookieSameSite = (process.env.SESSION_SAMESITE || (NODE_ENV === 'production' ? 'lax' : 'lax')).toLowerCase();
// Nota: si tu frontend está en OTRO dominio, para que el navegador envíe cookie cross-site, usa sameSite='none' y secure: true.
const cookieSecure = NODE_ENV === 'production' ? true : false; // false en desarrollo para HTTP

app.use(session({
    name: 'sid',
    secret: SESSION_SECRET || 'dev-insecure-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite, // 'lax'/'strict' en mismo dominio; 'none' si necesitas cross-site
        maxAge: 1000 * 60 * 60 * 2 // 2 horas
    }
}));

// Middlewares de seguridad
function ensureAuth(req, res, next) {
    const auth = req.session && req.session.auth;
    if (auth && auth.userId) {
        req.userId = auth.userId;
        req.role = auth.role;
        return next();
    }
    return res.status(401).json({ message: 'No autenticado' });
}

function ensureRole(role) {
    return (req, res, next) => {
        const auth = req.session && req.session.auth;
        if (!auth || !auth.userId) return res.status(401).json({ message: 'No autenticado' });
        if (auth.role === role) return next();
        return res.status(403).json({ message: 'Acceso denegado' });
    };
}

function ensureOwnerOrAdmin(paramName = 'id') {
    return (req, res, next) => {
        const auth = req.session && req.session.auth;
        if (!auth || !auth.userId) return res.status(401).json({ message: 'No autenticado' });
        if (auth.role === 'admin') return next();
        const target = parseInt(req.params[paramName], 10);
        if (!isNaN(target) && target === auth.userId) return next();
        return res.status(403).json({ message: 'Acceso denegado' });
    };
}

// Servir archivos estáticos
app.use('/css', express.static(path.join(__dirname, '../public/css'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use(express.static(path.join(__dirname, '../public/views')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
// REMOVER estas líneas duplicadas:
// app.use(cors());
// app.use(express.json());

////////////////////////
// RUTAS - USUARIOS
////////////////////////

app.get('/api/users', ensureRole('admin'), async (req, res) => {
    try {
        const users = await sesiones.getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/me', ensureAuth, async (req, res) => {
    try {
        const user = await sesiones.getUserById(req.userId);
        user ? res.json(user) : res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/:id', ensureOwnerOrAdmin('id'), async (req, res) => {
    try {
        const user = await sesiones.getUserById(req.params.id);
        user ? res.json(user) : res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { 
        username, 
        nombreCompleto,
        email, 
        password, 
        rut, 
        telefono, 
        direccion, 
        ciudad, 
        region
    } = req.body;

    if (!username || !nombreCompleto || !email || !password || !rut || !telefono || !direccion || !ciudad || !region) {
        return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }

    try {
        const userData = {
            username, 
            nombreCompleto,
            email, 
            password, 
            rut, 
            telefono, 
            direccion, 
            ciudad, 
            region
        };
        
        const user = await sesiones.createUser(userData);
        res.status(201).json({ message: 'Cuenta creada exitosamente', user });
    } catch (err) {
        if (err.message === 'USERNAME_EXISTS') {
            res.status(409).json({ message: 'Este nombre de usuario ya está registrado' });
        } else if (err.message === 'EMAIL_EXISTS') {
            res.status(409).json({ message: 'Este correo electrónico ya está en uso' });
        } else if (err.message === 'RUT_EXISTS') {
            res.status(409).json({ message: 'Este RUT ya está registrado' });
        } else {
            console.error('Error en registro:', err);
            res.status(500).json({ message: 'Error interno del servidor. Intenta nuevamente' });
        }
    }
});

// Nuevo endpoint de login con sesión
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await sesiones.validateUser({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        req.session.regenerate((err) => {
            if (err) {
                console.error('Error al regenerar sesión:', err);
                return res.status(500).json({ message: 'Error al iniciar sesión' });
            }
            req.session.auth = { userId: user.id, role: user.rol || 'usuario' };
            
            // Determinar la URL de redirección basada en el rol_id
            let redirectUrl = '/'; // URL por defecto para usuarios normales
            
            if (user.rol_id === 1) {
                // Admin - redirigir al panel de administrador
                redirectUrl = '/admin';
            } else if (user.rol_id === 2) {
                // Usuario normal - redirigir al index
                redirectUrl = '/';
            }
            
            res.json({ 
                message: 'Acceso autorizado', 
                user: { 
                    id: user.id, 
                    username: user.username, 
                    rol: user.rol || 'usuario',
                    rol_id: user.rol_id
                },
                redirectUrl: redirectUrl
            });
        });
    } catch (err) {
        console.error('Error del servidor al validar usuario:', err);
        res.status(500).json({ error: 'Error del servidor al validar usuario' });
    }
});

// Logout
app.post('/api/logout', ensureAuth, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.clearCookie('sid');
        res.json({ message: 'Sesión cerrada' });
    });
});

// IMPORTANTE: elimina/retira el endpoint antiguo /api/users/validate para evitar duplicados.
app.post('/api/users/validate', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await sesiones.validateUser({ username, password });
        user ? res.json({ message: 'Acceso autorizado', user }) : res.status(401).json({ message: 'Credenciales incorrectas' });
    } catch (err) {
        res.status(500).json({ error: 'Error del servidor al validar usuario' });
    }
});

////////////////////////
// RUTAS - PRODUCTOS
////////////////////////

app.get('/api/Productos', async (req, res) => {
    try {
        const data = await productos.getProductos();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/Productos/:id', async (req, res) => {
    try {
        const producto = await productos.getProductoById(req.params.id);
        producto ? res.json(producto) : res.status(404).json({ mensaje: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Nueva ruta para obtener solo el carrusel de imágenes de un producto
app.get('/api/Productos/:id/carrusel', async (req, res) => {
    try {
        const carrusel = await productos.getCarruselById(req.params.id);
        if (carrusel === null) {
            return res.status(404).json({ mensaje: 'Producto no encontrado o sin carrusel' });
        }
        res.json({ img_carrusel: carrusel });
    } catch (error) {
        console.error('Error al obtener carrusel:', error);
        res.status(500).json({ error: error.message });
    }
});

// Nueva ruta API dinámica para servir producto.html con ID del producto
app.get('/producto/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Validar que el ID sea un número válido
        if (!productId || isNaN(productId) || parseInt(productId) <= 0) {
            return res.status(400).json({ 
                error: 'ID de producto inválido. Debe ser un número positivo.' 
            });
        }
        
        // Verificar que el producto existe en la base de datos
        const producto = await productos.getProductoById(parseInt(productId));
        if (!producto) {
            return res.status(404).json({ 
                error: 'Producto no encontrado.' 
            });
        }
        
        // Verificar que el archivo producto.html existe
        const productoHtmlPath = path.join(__dirname, '../public/views/producto.html');
        if (!fs.existsSync(productoHtmlPath)) {
            return res.status(500).json({ 
                error: 'Archivo de producto no encontrado en el servidor.' 
            });
        }
        
        // Leer el archivo HTML
        let htmlContent = fs.readFileSync(productoHtmlPath, 'utf8');
        
        // Inyectar datos del producto en el HTML
        const productScript = `
            <script>
                window.productData = ${JSON.stringify(producto)};
                window.productId = ${productId};
                console.log('Datos del producto inyectados:', window.productData);
            </script>
        `;
        
        // Insertar el script antes del cierre del tag body
        htmlContent = htmlContent.replace('</body>', `${productScript}</body>`);
        
        // Establecer headers apropiados
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Enviar el archivo HTML modificado
        res.send(htmlContent);
        
    } catch (error) {
        console.error('Error al servir producto:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor al cargar el producto.' 
        });
    }
});


app.post('/api/Productos', async (req, res) => {
    try {
        const id = await productos.insertProducto(req.body);
        res.status(201).json({ mensaje: 'Producto creado', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/Productos/:id', async (req, res) => {
    try {
        await productos.updateProducto(req.params.id, req.body);
        res.json({ mensaje: 'Producto actualizado' });
    } catch (error) {
        if (error.message === 'No encontrado') {
            res.status(404).json({ mensaje: 'No encontrado' });
        } else {
            console.error('❌ Error en PUT /api/Productos/:id:', error);
            res.status(500).json({ error: error.message });
        }
    }
});

app.delete('/api/Productos/:id', async (req, res) => {
    try {
        await productos.deleteProducto(req.params.id);
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        if (error.message === 'No encontrado') {
            res.status(404).json({ mensaje: 'No encontrado' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

////////////////////////
// RUTAS - CARRITO
////////////////////////

app.get('/api/carrito', ensureAuth, async (req, res) => {
    try {
        const data = await carrito.getCarrito(req.userId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/carrito', ensureAuth, async (req, res) => {
    const { producto_id, cantidad } = req.body;
    if (!producto_id || !cantidad) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        await carrito.agregarAlCarrito(req.userId, producto_id, cantidad);
        res.status(201).json({ mensaje: 'Producto agregado/actualizado en carrito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/carrito', ensureAuth, async (req, res) => {
    const { producto_id, cantidad } = req.body;
    if (!producto_id || !cantidad) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        await carrito.actualizarCantidad(req.userId, producto_id, cantidad);
        res.json({ mensaje: 'Cantidad actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/carrito', ensureAuth, async (req, res) => {
    const { producto_id } = req.body;
    if (!producto_id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        await carrito.eliminarDelCarrito(req.userId, producto_id);
        res.json({ mensaje: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/carrito/clear', ensureAuth, async (req, res) => {
    try {
        await carrito.vaciarCarrito(req.userId);
        res.json({ mensaje: 'Carrito vaciado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

////////////////////////
// CATEGORIAS
////////////////////////

// Ruta pública para obtener todas las categorías (para frontend público)
app.get('/api/categorias', async (req, res) => {
    try {
        const data = await categorias.getCategorias();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rutas de administración para categorías (requieren sesión de admin)
app.get('/api/admin/categorias', ensureRole('admin'), async (req, res) => {
    try {
        const data = await categorias.getCategorias();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/categorias', ensureRole('admin'), async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

    try {
        const nueva = await categorias.insertCategoria(nombre);
        res.status(201).json(nueva);
    } catch (err) {
        if (err.message === 'CATEGORIA_EXISTS') {
            res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Obtener una categoría específica por ID (solo admin)
app.get('/api/admin/categorias/:id', ensureRole('admin'), async (req, res) => {
    try {
        const categoria = await categorias.getCategoriaById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(categoria);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar una categoría (solo admin)
app.put('/api/admin/categorias/:id', ensureRole('admin'), async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

    try {
        const categoria = await categorias.updateCategoria(req.params.id, { nombre });
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ mensaje: 'Categoría actualizada', categoria });
    } catch (err) {
        if (err.message === 'CATEGORIA_EXISTS') {
            res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Eliminar una categoría (solo admin)
app.delete('/api/admin/categorias/:id', ensureRole('admin'), async (req, res) => {
    try {
        const resultado = await categorias.deleteCategoria(req.params.id);
        if (!resultado) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (err) {
        if (err.message === 'CATEGORIA_IN_USE') {
            res.status(409).json({ error: 'No se puede eliminar la categoría porque está siendo utilizada por productos' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Mantener compatibilidad con rutas antiguas
app.post('/api/categorias', ensureRole('admin'), async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

    try {
        const nueva = await categorias.insertCategoria(nombre);
        res.status(201).json(nueva);
    } catch (err) {
        if (err.message === 'CATEGORIA_EXISTS') {
            res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

app.get('/api/categorias/:id', ensureRole('admin'), async (req, res) => {
    try {
        const categoria = await categorias.getCategoriaById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(categoria);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categorias/:id', ensureRole('admin'), async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

    try {
        const categoria = await categorias.updateCategoria(req.params.id, { nombre });
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ mensaje: 'Categoría actualizada', categoria });
    } catch (err) {
        if (err.message === 'CATEGORIA_EXISTS') {
            res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

app.delete('/api/categorias/:id', ensureRole('admin'), async (req, res) => {
    try {
        const resultado = await categorias.deleteCategoria(req.params.id);
        if (!resultado) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (err) {
        if (err.message === 'CATEGORIA_IN_USE') {
            res.status(409).json({ error: 'No se puede eliminar la categoría porque está siendo utilizada por productos' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Obtener las categorías de un producto
app.get('/api/Productos/:id/categorias', async (req, res) => {
    try {
        const data = await productos.getCategoriasDeProducto(req.params.id);
        if (!data) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error en ruta /categorias:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Asignar categorías (reemplaza todas las anteriores)
app.post('/api/Productos/:id/categorias', async (req, res) => {
    const { categorias } = req.body;
    if (!Array.isArray(categorias)) {
        return res.status(400).json({ error: 'Debe enviar un array de IDs de categorías' });
    }

    try {
        await productos.asignarCategoriasAProducto(req.params.id, categorias);
        res.status(200).json({ mensaje: 'Categorías asignadas correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar una sola categoría (sin borrar las anteriores)
app.post('/api/Productos/:id/categorias/:categoriaId', async (req, res) => {
    try {
        await productos.agregarCategoriaAProducto(req.params.id, req.params.categoriaId);
        res.status(200).json({ mensaje: 'Categoría añadida al producto' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Quitar una categoría del producto
app.delete('/api/Productos/:id/categorias/:categoriaId', async (req, res) => {
    try {
        const { id, categoriaId } = req.params;
        await productos.eliminarCategoriaDeProducto(id, categoriaId);
        res.json({ success: true, message: 'Categoría eliminada del producto exitosamente' });
    } catch (error) {
        console.error('Error al eliminar categoría del producto:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

////////////////////////
// MERCADOPAGO
////////////////////////

// Configuración de MercadoPago SDK 2.x
const client = new MercadoPagoConfig({
    accessToken: process.env.Access_token,
    options: {
        timeout: 5000,
        idempotencyKey: 'abc'
    }
});

app.post('/api/pago', ensureAuth, async (req, res) => {
    try {
        const usuario_id = req.userId;

        // Obtener información del usuario
        const usuario = await sesiones.getUserById(usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const carritoItems = await carrito.getCarrito(usuario_id);
        if (!carritoItems || carritoItems.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        // Formatear items para MercadoPago
        const items = carritoItems.map(item => ({
            id: item.producto_id.toString(),
            title: item.nombre || `Producto ${item.producto_id}`,
            description: item.descripcion || 'Producto de la tienda',
            quantity: parseInt(item.cantidad),
            unit_price: parseInt(item.precio),
            currency_id: 'CLP'  // Changed from 'COP' to 'ARS'
        }));

        // Formatear información del pagador
        const payer = {
            name: usuario.nombre,
            surname: usuario.apellido || '',
            email: usuario.email,
            phone: {
                area_code: '57',
                number: usuario.telefono || '3001234567'
            },
            identification: {
                type: 'CC',
                number: usuario.cedula || '12345678'
            },
            address: {
                street_name: usuario.direccion || 'Calle 123',
                street_number: 123,
                zip_code: '110111'
            }
        };
        
        const preference = new Preference(client);
        const ngrok = process.env.Dominio_H;
        const preferenceData = {
            items: items,
            payer: payer,
            back_urls: {
                success: ngrok + "/api/pago-exitoso",
                failure: ngrok + "/api/pago-fallido",
                pending: ngrok + "/api/pago-pendiente"
            },
            auto_return: "approved",
            // external_reference solo como apoyo (no se confía en él para identidad)
            external_reference: usuario_id.toString(),
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12
            },
            shipments: {
                mode: "not_specified"
            },
            notification_url: ngrok + "/api/webhook-mercadopago"
        };
        
        const response = await preference.create({ body: preferenceData });
        // NO seteamos cookies manuales aquí; la sesión ya maneja la cookie.
        res.json({ init_point: response.init_point });
    } catch (error) {
        console.error('Error al crear preferencia:', error);
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
});

// Pago exitoso (se espera que el usuario mantenga su sesión activa)
app.get('/api/pago-exitoso', ensureAuth, async (req, res) => {
    const { payment_id } = req.query;
    const usuario_id = req.userId;

    if (!payment_id) {
        return res.redirect('/payments/payment-failed.html?reason=ID de pago no encontrado');
    }

    try {
        const user = await sesiones.getUserById(usuario_id);
        const items = await carrito.getCarrito(usuario_id);

        if (!user || !items || items.length === 0) {
            return res.redirect('/payments/payment-failed.html?reason=Datos de compra no encontrados');
        }

        // Validación básica: evitar doble procesamiento por payment_id
        const ventaExistente = await historial.getVentaByPaymentId(payment_id);
        if (ventaExistente) {
            const params = new URLSearchParams({
                order_id: payment_id,
                user_id: usuario_id,
                subtotal: ventaExistente.subtotal.toFixed(2),
                items: JSON.stringify(ventaExistente.detalles)
            });
            return res.redirect(`/payments/payment-success.html?${params.toString()}`);
        }

        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.precio) * parseInt(item.cantidad)), 0);

        const detallesVenta = items.map(item => ({
            producto_id: item.producto_id,
            nombre: item.nombre,
            cantidad: parseInt(item.cantidad),
            precio_unitario: parseFloat(item.precio),
            descuento_aplicado: item.descuento_aplicado || 0,
            subtotal: parseFloat(item.precio) * parseInt(item.cantidad)
        }));

        await historial.crearVenta(usuario_id, detallesVenta, payment_id);
        await carrito.vaciarCarrito(usuario_id);

        const params = new URLSearchParams({
            order_id: payment_id,
            user_id: usuario_id,
            payment_id: payment_id,
            subtotal: subtotal.toFixed(2),
            items: JSON.stringify(items.map(item => ({
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: parseFloat(item.precio).toFixed(2)
            })))
        });

        res.redirect(`/payments/payment-succes.html?${params.toString()}`);

    } catch (error) {
        console.error("Error en pago-exitoso:", error);
        res.redirect('/payments/payment-failed.html?reason=Error interno del servidor');
    }
});

app.get('/api/pago-fallido', ensureAuth, async (req, res) => {
    const payment_id = req.query.payment_id;
    const collection_id = req.query.collection_id;

    console.log('Pago fallido recibido:', { userId: req.userId, payment_id, collection_id });

    const params = new URLSearchParams({
        order_id: payment_id || `ORD-FAIL-${Date.now()}`,
        reason: 'Pago rechazado por la entidad financiera'
    });

    res.redirect(`/payments/payment-failed.html?${params.toString()}`);
});

app.get('/api/pago-pendiente', ensureAuth, async (req, res) => {
    const payment_id = req.query.payment_id;
    const collection_id = req.query.collection_id;

    console.log('Pago pendiente:', { userId: req.userId, payment_id, collection_id });

    try {
        const items = await carrito.getCarrito(req.userId);
        const total = items.reduce((sum, item) => sum + (parseFloat(item.precio) * parseInt(item.cantidad)), 0);

        const params = new URLSearchParams({
            status: 'pending',
            order_id: `ORD-${Date.now()}`,
            amount: total,
            payment_id: payment_id || 'N/A'
        });

        res.redirect(`/payments/payments-pending.html?${params.toString()}`);
    } catch (error) {
        console.error('Error en pago pendiente:', error);
        const params = new URLSearchParams({
            status: 'pending',
            order_id: `ORD-${Date.now()}`,
            reason: 'Pago en proceso de verificación'
        });
        res.redirect(`/payments.html?${params.toString()}`);
    }
});

app.post('/api/webhook-mercadopago', express.raw({type: 'application/json'}), (req, res) => {
    // Verificar si el webhook está habilitado
    const webhookEnabled = process.env.WEBHOOK_ENABLED !== 'false';
    
    if (!webhookEnabled) {
        console.log('⚠️ Webhook desactivado por configuración');
        return res.status(200).json({ 
            status: 'disabled', 
            message: 'Webhook temporalmente desactivado' 
        });
    }
    
    console.log('Webhook recibido:', req.body);
    res.status(200).send('OK');
});

////////////////////////
// RUTAS - HISTORIAL
////////////////////////

app.get('/api/historial', ensureAuth, async (req, res) => {
    try {
        const data = await historial.getHistorial(req.userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin: ver todo el historial
app.get('/api/historial/admin', ensureRole('admin'), async (req, res) => {
    try {
        const data = await historial.getAllHistorial();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/historial', ensureAuth, async (req, res) => {
    try {
        const { detalles } = req.body; // usuario actual desde sesión
        const ventaId = await historial.crearVenta(req.userId, detalles);
        res.status(201).json({ mensaje: 'Venta registrada', venta_id: ventaId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/historial/:venta_id/estado', ensureRole('admin'), async (req, res) => {
    try {
        const { estado } = req.body;
        await historial.actualizarEstadoVenta(req.params.venta_id, estado);
        res.json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

////////////////////////
// RUTAS - DESCUENTOS
////////////////////////

// Obtener todos los descuentos (público o autenticado, según tu necesidad)
app.get('/api/descuentos', async (req, res) => {
    try {
        const allDescuentos = await descuentos.getAllDescuentos();
        
        // Obtener información de productos para mapear nombres
        const productosData = await productos.getProductos();
        const productosMap = {};
        productosData.forEach(p => {
            productosMap[p.id] = p.nombre || p.name;
        });
        
        // Mapear descuentos con nombres de productos
        const descuentosConNombres = allDescuentos.map(descuento => ({
            id: descuento.id,
            producto_id: descuento.producto_id,
            productName: productosMap[descuento.producto_id] || 'Producto no encontrado',
            minQuantity: descuento.cantidad_minima,
            percentage: descuento.porcentaje_descuento,
            active: descuento.activo !== false // Por defecto true si no está definido
        }));
        
        res.json(descuentosConNombres);
    } catch (error) {
        console.error('Error al obtener descuentos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Crear descuento: solo admin
app.post('/api/descuentos', ensureRole('admin'), async (req, res) => {
    try {
        const { productId, minQuantity, percentage, active } = req.body;
        
        const result = await descuentos.crearDescuento(
            Number(productId), 
            Number(minQuantity), 
            Number(percentage),
            Boolean(active)
        );
        
        if (result) {
            res.status(201).json({ success: true, message: 'Descuento creado exitosamente' });
        } else {
            res.status(400).json({ success: false, message: 'Error al crear descuento' });
        }
    } catch (error) {
        console.error('Error al crear descuento:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Actualizar descuento: solo admin
app.put('/api/descuentos/:id', ensureRole('admin'), async (req, res) => {
    try {
        const { productId, minQuantity, percentage, active } = req.body;
        const id = req.params.id;
        
        console.log('Intentando actualizar descuento:', {
            id,
            productId,
            minQuantity,
            percentage,
            active
        });
        
        // Verificar que el descuento existe antes de intentar actualizarlo
        const descuentos = require('../js/Descuentos/service');
        const allDescuentos = await descuentos.getAllDescuentos();
        
        console.log('Descuentos existentes:', allDescuentos);
        
        const descuentoExistente = allDescuentos.find(d => d.id === Number(id));
        
        if (!descuentoExistente) {
            console.log(`Descuento con ID ${id} no encontrado`);
            return res.status(404).json({ 
                success: false, 
                message: 'Descuento no encontrado' 
            });
        }
        
        const result = await descuentos.actualizarDescuento(
            Number(id),
            Number(productId), 
            Number(minQuantity), 
            Number(percentage),
            active !== false // Por defecto true si no está definido
        );
        
        if (result) {
            console.log('Descuento actualizado exitosamente');
            res.json({ success: true, message: 'Descuento actualizado exitosamente' });
        } else {
            console.log('No se pudo actualizar el descuento');
            res.status(400).json({ 
                success: false, 
                message: 'No se pudo actualizar el descuento. Puede que ya exista un descuento con los mismos parámetros.' 
            });
        }
    } catch (error) {
        console.error('Error al actualizar descuento:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Eliminar descuento: solo admin
app.delete('/api/descuentos/:id', ensureRole('admin'), async (req, res) => {
    try {
        const result = await descuentos.eliminarDescuento(Number(req.params.id));
        
        if (result) {
            res.json({ success: true, message: 'Descuento eliminado exitosamente' });
        } else {
            res.status(400).json({ success: false, message: 'Error al eliminar descuento' });
        }
    } catch (error) {
        console.error('Error al eliminar descuento:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

////////////////////////
// CONFIGURACIÓN DEL SERVIDOR
////////////////////////

// Servidor HTTP siempre disponible
app.listen(HTTP_PORT, () => {
    console.log(`🌐 Servidor HTTP ejecutándose en http://localhost:${HTTP_PORT}`);
});

// Intentar iniciar servidor HTTPS (opcional)
try {
    if (fs.existsSync(path.join(__dirname, '../key.pem')) && fs.existsSync(path.join(__dirname, '../cert.pem'))) {
        const options = {
            key: fs.readFileSync(path.join(__dirname, '../key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../cert.pem'))
        };
        
        https.createServer(options, app).listen(PORT, () => {
            console.log(`🔒 Servidor HTTPS ejecutándose en https://localhost:${PORT}`);
        });
    } else {
        console.log(`⚠️  Certificados SSL no encontrados en ${__dirname}/../`);
        console.log(`📋 Solo HTTP disponible: http://localhost:${HTTP_PORT}`);
    }
} catch (error) {
    console.log(`⚠️  Error al iniciar HTTPS: ${error.message}`);
    console.log(`📋 Solo HTTP disponible: http://localhost:${HTTP_PORT}`);
}
// Endpoint para obtener RUT desencriptado (solo para roles autorizados)
app.get('/api/users/:id/rut', ensureRole('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Obtener el usuario con RUT desencriptado
        const user = await sesiones.getUserById(userId, true); // includeRut = true para desencriptar
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        // Retornar el RUT ya desencriptado por el servicio
        res.json({ rut: user.rut });
    } catch (err) {
        console.error('Error al obtener RUT desencriptado:', err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para obtener RUT desencriptado (solo para roles autorizados)
app.get('/api/users/:id/rut', ensureRole('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Obtener el usuario con RUT desencriptado
        const user = await sesiones.getUserById(userId, true); // includeRut = true para desencriptar
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        // Retornar el RUT ya desencriptado por el servicio
        res.json({ rut: user.rut });
    } catch (err) {
        console.error('Error al obtener RUT desencriptado:', err);
        res.status(500).json({ error: err.message });
    }
});

// (ya definidos arriba) ensureAuth, ensureRole, ensureOwnerOrAdmin
app.get('/api/admin/ping', ensureRole('admin'), (req, res) => {
    return res.status(200).json({ ok: true, role: req.session.auth.role });
});
