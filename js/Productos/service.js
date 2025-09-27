const { Producto, Categoria } = require('../Models');
const jsonFallback = require('./json');
const { getRelaciones,getCategorias } = require('../Productos/json');
let useFallback = false;

// Verifica conexión a la base de datos
async function isConnected() {
  try {
    await Producto.sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('Base de datos no disponible:', error.message);
    return false;
  }
}

// === CRUD de Productos ===

async function getProductos() {
  if (useFallback) return jsonFallback.getProducto();
  return await Producto.findAll({
    include: [{
      model: Categoria,
      as: 'categorias',
      through: { attributes: [] } // Excluir atributos de la tabla intermedia
    }]
  });
}

async function getProductoById(id) {
  if (useFallback) return jsonFallback.getProductoById(id);
  return await Producto.findByPk(id, {
    include: [{
      model: Categoria,
      as: 'categorias',
      through: { attributes: [] }
    }]
  });
}

async function insertProducto(data) {
  if (useFallback) return jsonFallback.insertProducto(data);

  const { categorias = [], ...productoData } = data;
  const producto = await Producto.create(productoData);

  if (Array.isArray(categorias) && categorias.length > 0) {
    await producto.setCategorias(categorias);
  }

  return producto.id;
}

async function updateProducto(id, data) {
  console.log('=== DEBUG updateProducto ===');
  console.log('ID:', id);
  console.log('Data recibida:', JSON.stringify(data, null, 2));
  console.log('Categorias:', data.categorias);
  console.log('Tipo de categorias:', typeof data.categorias);
  console.log('Es array:', Array.isArray(data.categorias));
  
  if (useFallback) return jsonFallback.updateProducto(id, data);

  const { categorias, ...productoData } = data;
  console.log('Categorias extraidas:', categorias);
  console.log('ProductoData:', productoData);
  
  const producto = await Producto.findByPk(id);
  if (!producto) throw new Error('No encontrado');

  await producto.update(productoData);
  console.log('Producto actualizado');

  if (Array.isArray(categorias)) {
    console.log('Actualizando categorias:', categorias);
    try {
      await producto.setCategorias(categorias);
      console.log('Categorias actualizadas exitosamente');
    } catch (error) {
      console.error('Error al actualizar categorias:', error);
      throw error;
    }
  } else {
    console.log('Categorias no es un array o es undefined');
  }
}

async function deleteProducto(id) {
  if (useFallback) return jsonFallback.deleteProducto(id);
  await Producto.destroy({ where: { id } });
}

// === Relación Producto <-> Categorías ===

function getCategoriasDeProducto(productoId) {
  const relaciones = getRelaciones(); 
  const categorias = getCategorias();        
  const ids = relaciones
    .filter(r => r.producto_id === Number(productoId))
    .map(r => r.categoria_id);

  return categorias.filter(c => ids.includes(c.id));
}


async function asignarCategoriasAProducto(productoId, categoriaIds) {
  if (useFallback) return jsonFallback.asignarCategoriasAProducto(productoId, categoriaIds);

  const producto = await Producto.findByPk(productoId);
  if (!producto) throw new Error('Producto no encontrado');

  await producto.setCategorias(categoriaIds);
  return true;
}

async function agregarCategoriaAProducto(productoId, categoriaId) {
  if (useFallback) return jsonFallback.agregarCategoriaAProducto(productoId, categoriaId);

  const producto = await Producto.findByPk(productoId);
  if (!producto) throw new Error('Producto no encontrado');

  await producto.addCategoria(categoriaId);
  return true;
}

async function quitarCategoriaAProducto(productoId, categoriaId) {
  if (useFallback) return jsonFallback.quitarCategoriaAProducto(productoId, categoriaId);

  const producto = await Producto.findByPk(productoId);
  if (!producto) throw new Error('Producto no encontrado');

  await producto.removeCategoria(categoriaId);
  return true;
}

// Nueva función para reducir stock
async function reducirStock(producto_id, cantidad) {
  if (useFallback) {
    // Para el fallback JSON, necesitarías implementar la lógica en json.js
    return jsonFallback.reducirStock(producto_id, cantidad);
  }

  const producto = await Producto.findByPk(producto_id);
  if (!producto) {
    throw new Error(`Producto con ID ${producto_id} no encontrado`);
  }

  if (producto.stock < cantidad) {
    throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Stock actual: ${producto.stock}, cantidad solicitada: ${cantidad}`);
  }

  const nuevoStock = producto.stock - cantidad;
  await producto.update({ stock: nuevoStock });
  
  return nuevoStock;
}

// Nueva función para obtener solo el carrusel de imágenes
async function getCarruselById(id) {
  if (useFallback) return jsonFallback.getCarruselById(id);

  const producto = await Producto.findByPk(id, {
    attributes: ['img_carrusel', 'imagen_url']
  });

  if (!producto) return null;

  let carrusel = producto.img_carrusel.imagenes
  carrusel.push(producto.imagen_url);
  return carrusel;
}


// === Exportar funciones ===
module.exports = {
  getProductos,
  getProductoById,
  insertProducto,
  updateProducto,
  deleteProducto,
  getCategoriasDeProducto,
  asignarCategoriasAProducto,
  agregarCategoriaAProducto,
  quitarCategoriaAProducto,
  reducirStock,
  getCarruselById  // Nueva función exportada
};
// === Inicializa fallback automáticamente ===
(async () => {
  useFallback = !(await isConnected());
  console.log(useFallback ? '🟡 Fallback JSON activado para Productos' : '🟢 DB conectada para Productos');
})();
