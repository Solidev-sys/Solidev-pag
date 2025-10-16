const { Suscripcion, Usuario, Plan, Pago } = require('../Models');

async function isConnected() {
  try {
    await Suscripcion.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getSubscriptions() {
  try {
    const subs = await Suscripcion.findAll({
      include: [
        { model: Usuario },
        { model: Plan },
        { model: Pago, as: 'pagos' }
      ]
    });
    return subs.map(s => s.toJSON());
  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
    return [];
  }
}

async function getSubscriptionById(id) {
  try {
    const sub = await Suscripcion.findByPk(id, {
      include: [
        { model: Usuario },
        { model: Plan },
        { model: Pago, as: 'pagos' }
      ]
    });
    return sub ? sub.toJSON() : null;
  } catch (error) {
    console.error('Error al obtener suscripción:', error);
    return null;
  }
}

async function createSubscription(data) {
  try {
    const sub = await Suscripcion.create(data);
    return sub.toJSON();
  } catch (error) {
    console.error('Error al crear suscripción:', error);
    throw error;
  }
}

async function updateSubscription(id, data) {
  try {
    const [rows] = await Suscripcion.update(data, { where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al actualizar suscripción:', error);
    return false;
  }
}

async function cancelSubscription(id, motivo) {
  try {
    const [rows] = await Suscripcion.update(
      { estado: 'cancelada', motivo_cancelacion: motivo ?? null, cancelada_en: new Date() },
      { where: { id } }
    );
    return rows > 0;
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    return false;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Suscripciones' : '🔴 DB desconectada para Suscripciones');
})();

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  cancelSubscription
};