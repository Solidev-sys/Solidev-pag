const { Webhook, Usuario } = require('../Models');

async function isConnected() {
  try {
    await Webhook.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getWebhooks() {
  try {
    const wh = await Webhook.findAll({ include: [{ model: Usuario }] });
    return wh.map(w => w.toJSON());
  } catch (error) {
    console.error('Error al obtener webhooks:', error);
    return [];
  }
}

async function getWebhookById(id) {
  try {
    const wh = await Webhook.findByPk(id, { include: [{ model: Usuario }] });
    return wh ? wh.toJSON() : null;
  } catch (error) {
    console.error('Error al obtener webhook:', error);
    return null;
  }
}

async function createWebhook(data) {
  try {
    const wh = await Webhook.create(data);
    return wh.toJSON();
  } catch (error) {
    console.error('Error al crear webhook:', error);
    throw error;
  }
}

async function markWebhookProcessed(id, errorMsg = null) {
  try {
    const [rows] = await Webhook.update(
      { procesado: true, procesado_en: new Date(), error_proceso: errorMsg },
      { where: { id } }
    );
    return rows > 0;
  } catch (error) {
    console.error('Error al marcar webhook procesado:', error);
    return false;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Webhooks' : '🔴 DB desconectada para Webhooks');
})();

module.exports = {
  getWebhooks,
  getWebhookById,
  createWebhook,
  markWebhookProcessed
};