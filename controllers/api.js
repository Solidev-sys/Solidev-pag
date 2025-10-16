const express = require('express');
require('dotenv').config();

// Integraciones modularizadas
const { setupCors } = require('./config/cors');
const { setupSession } = require('./config/session');
const { ensureAuth, ensureRole, ensureOwnerOrAdmin } = require('./middleware/auth');
const { createMercadoPagoClient } = require('./services/mercadopago');
const createPaymentsRouter = require('./routes/payments');
const createWebhookRouter = require('./routes/webhook');
const { startHttpsServer } = require('./server/https');
const createSuscripcionesRouter = require('./routes/suscripciones');
const createPagosRouter = require('./routes/pagos');
const createFacturasRouter = require('./routes/facturas');
const createNotificacionesRouter = require('./routes/notificaciones');
const createPlanesRouter = require('./routes/planes');
const createCaracteristicasRouter = require('./routes/caracteristicasPlan');
const createPaginasRouter = require('./routes/paginas');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTP_PORT = process.env.HTTP_PORT || 3002;

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
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
// Si no configuras CORS_ORIGINS, se permitirá cualquier origen en desarrollo (no recomendado en prod)
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // requests sin origin (postman, curl) permitidas
        if (allowedOrigins.length === 0 && NODE_ENV !== 'production') return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true
};

// Body parser y configuración modular
app.use(express.json());
setupCors(app);
setupSession(app);

// Inicializar Mercado Pago y montar routers al nivel superior
const { client, Preference } = createMercadoPagoClient();
const preference = new Preference(client);
const ngrok = process.env.NGROK_URL;

const paymentsRouter = createPaymentsRouter({
    ensureAuth,
    preference,
    ngrok
});
app.use('/api', paymentsRouter);

const webhookRouter = createWebhookRouter();
app.use('/api', webhookRouter);

// Inicio de servidor HTTP y log correcto de puerto
app.listen(HTTP_PORT, () => {
    console.log(`📋 Servidor HTTP ejecutándose en http://localhost:${HTTP_PORT}`);
});
try {
    if (fs.existsSync('key.pem') && fs.existsSync('cert.pem')) {
        const options = {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem')
        };
        
        https.createServer(options, app).listen(PORT, () => {
            console.log(`🔒 Servidor HTTPS ejecutándose en https://localhost:${PORT}`);
        });
    } else {
        console.log(`⚠️  Certificados SSL no encontrados. Solo HTTP disponible.`);
    }
} catch (error) {
    console.log(`⚠️  Error al iniciar HTTPS: ${error.message}`);
    console.log(`📋 Solo HTTP disponible: http://localhost:${PORT}`);
}

const suscripcionesRouter = createSuscripcionesRouter({ ensureAuth, ensureRole });
app.use('/api', suscripcionesRouter);

const pagosRouter = createPagosRouter({ ensureAuth, ensureRole });
app.use('/api', pagosRouter);

const facturasRouter = createFacturasRouter({ ensureAuth, ensureRole });
app.use('/api', facturasRouter);

const notificacionesRouter = createNotificacionesRouter({ ensureAuth, ensureRole });
app.use('/api', notificacionesRouter);

const planesRouter = createPlanesRouter({ ensureAuth, ensureRole });
app.use('/api', planesRouter);

const caracteristicasRouter = createCaracteristicasRouter({ ensureAuth, ensureRole });
app.use('/api', caracteristicasRouter);

const paginasRouter = createPaginasRouter({ ensureAuth, ensureRole });
app.use('/api', paginasRouter);
