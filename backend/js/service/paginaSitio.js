const { PaginaSitio } = require('../Models');

async function isConnected() {
  try {
    await PaginaSitio.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getPages() {
  try {
    const pages = await PaginaSitio.findAll();
    return pages.map(p => p.toJSON());
  } catch (error) {
    console.error('Error al obtener páginas del sitio:', error);
    return [];
  }
}

async function getPageBySlug(slug) {
  try {
    const page = await PaginaSitio.findOne({ where: { slug } });
    return page ? page.toJSON() : null;
  } catch (error) {
    console.error('Error al obtener página por slug:', error);
    return null;
  }
}

async function createPage(data) {
  try {
    if (data.slug) {
      const exists = await PaginaSitio.findOne({ where: { slug: data.slug } });
      if (exists) throw new Error('El slug ya existe');
    }
    const page = await PaginaSitio.create(data);
    return page.toJSON();
  } catch (error) {
    console.error('Error al crear página:', error);
    throw error;
  }
}

async function updatePage(id, data) {
  try {
    if (data.slug) {
      const existing = await PaginaSitio.findOne({
        where: { slug: data.slug, id: { [PaginaSitio.sequelize.Op.ne]: id } }
      });
      if (existing) throw new Error('El slug ya está en uso por otra página');
    }
    const [rows] = await PaginaSitio.update(data, { where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al actualizar página:', error);
    return false;
  }
}

async function deletePage(id) {
  try {
    const rows = await PaginaSitio.destroy({ where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al eliminar página:', error);
    return false;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Páginas del Sitio' : '🔴 DB desconectada para Páginas del Sitio');
})();

module.exports = {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage
};