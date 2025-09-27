// categorias/service.js
const { Categoria } = require('../Models');
const jsonFallback = require('./json');

let useFallback = false;

async function isConnected() {
  try {
    await Categoria.sequelize.authenticate();
    return true;
  } catch {
    return false;
  }
}

async function getCategorias() {
  if (useFallback) return jsonFallback.getCategorias();
  return await Categoria.findAll();
}

async function getCategoriaById(id) {
  if (useFallback) {
    const data = jsonFallback.getCategoriasSync();
    return data.find(c => c.id == id) || null;
  }
  
  const categoria = await Categoria.findByPk(id);
  return categoria ? categoria.toJSON() : null;
}

async function insertCategoria(nombre) {
  if (useFallback) {
    const data = jsonFallback.getCategoriasSync();
    
    // Verificar si ya existe
    if (data.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
      throw new Error('CATEGORIA_EXISTS');
    }
    
    const id = data.length ? Math.max(...data.map(c => c.id)) + 1 : 1;
    const nueva = { id, nombre };
    data.push(nueva);
    jsonFallback.writeCategorias(data);
    return nueva;
  }

  try {
    const nueva = await Categoria.create({ nombre });
    return nueva.toJSON();
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('CATEGORIA_EXISTS');
    }
    throw error;
  }
}

async function updateCategoria(id, datos) {
  if (useFallback) {
    const data = jsonFallback.getCategoriasSync();
    const index = data.findIndex(c => c.id == id);
    
    if (index === -1) return null;
    
    // Verificar si el nuevo nombre ya existe en otra categoría
    if (datos.nombre && data.some(c => c.id != id && c.nombre.toLowerCase() === datos.nombre.toLowerCase())) {
      throw new Error('CATEGORIA_EXISTS');
    }
    
    data[index] = { ...data[index], ...datos };
    jsonFallback.writeCategorias(data);
    return data[index];
  }

  try {
    const [updatedRows] = await Categoria.update(datos, {
      where: { id },
      returning: true
    });
    
    if (updatedRows === 0) return null;
    
    const categoria = await Categoria.findByPk(id);
    return categoria ? categoria.toJSON() : null;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('CATEGORIA_EXISTS');
    }
    throw error;
  }
}

async function deleteCategoria(id) {
  if (useFallback) {
    const data = jsonFallback.getCategoriasSync();
    const index = data.findIndex(c => c.id == id);
    
    if (index === -1) return null;
    
    // Verificar si está en uso (esto requeriría verificar productos)
    // Por simplicidad, asumimos que se puede eliminar en modo fallback
    
    data.splice(index, 1);
    jsonFallback.writeCategorias(data);
    return true;
  }

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return null;
    
    // Verificar si está en uso por productos
    const productosConCategoria = await categoria.sequelize.query(
      'SELECT COUNT(*) as count FROM producto_categorias WHERE categoria_id = ?',
      {
        replacements: [id],
        type: categoria.sequelize.QueryTypes.SELECT
      }
    );
    
    if (productosConCategoria[0].count > 0) {
      throw new Error('CATEGORIA_IN_USE');
    }
    
    await categoria.destroy();
    return true;
  } catch (error) {
    if (error.message === 'CATEGORIA_IN_USE') {
      throw error;
    }
    throw error;
  }
}

// Inicializa conexión al iniciar
(async () => {
  useFallback = !(await isConnected());
  console.log(useFallback ? '🟡 Fallback JSON activado para Categorías' : '🟢 DB conectada para Categorías');
})();

module.exports = {
  getCategorias,
  getCategoriaById,
  insertCategoria,
  updateCategoria,
  deleteCategoria
};
