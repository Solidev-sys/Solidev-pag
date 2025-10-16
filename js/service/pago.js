const { Pago, Suscripcion, Usuario, Factura } = require('../Models');

async function isConnected() {
  try {
    await Pago.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getPayments() {
  try {
    const pagos = await Pago.findAll({
      include: [
        { model: Suscripcion },
        { model: Usuario },
        { model: Factura, as: 'factura' }
      ]
    });
    return pagos.map(p => p.toJSON());
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return [];
  }
}

async function getPaymentById(id) {
  try {
    const pago = await Pago.findByPk(id, {
      include: [
        { model: Suscripcion },
        { model: Usuario },
        { model: Factura, as: 'factura' }
      ]
    });
    return pago ? pago.toJSON() : null;
  } catch (error) {
    console.error('Error al obtener pago:', error);
    return null;
  }
}

async function createPayment(data) {
  try {
    if (data.mp_payment_id) {
      const existing = await Pago.findOne({ where: { mp_payment_id: data.mp_payment_id } });
      if (existing) throw new Error('El mp_payment_id ya existe');
    }
    const pago = await Pago.create(data);
    return pago.toJSON();
  } catch (error) {
    console.error('Error al crear pago:', error);
    throw error;
  }
}

async function updatePayment(id, data) {
  try {
    const [rows] = await Pago.update(data, { where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    return false;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Pagos' : '🔴 DB desconectada para Pagos');
})();

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment
};