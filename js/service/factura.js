const { Factura, Pago } = require('../Models');

async function isConnected() {
  try {
    await Factura.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getInvoices() {
  try {
    const facturas = await Factura.findAll({ include: [{ model: Pago, as: 'pago' }] });
    return facturas.map(f => f.toJSON());
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    return [];
  }
}

async function getInvoiceById(id) {
  try {
    const factura = await Factura.findByPk(id, { include: [{ model: Pago, as: 'pago' }] });
    return factura ? factura.toJSON() : null;
  } catch (error) {
    console.error('Error al obtener factura:', error);
    return null;
  }
}

async function createInvoice(data) {
  try {
    const factura = await Factura.create(data); // hook valida pago aprobado
    return factura.toJSON();
  } catch (error) {
    console.error('Error al crear factura:', error);
    throw error;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Facturas' : '🔴 DB desconectada para Facturas');
})();

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice
};