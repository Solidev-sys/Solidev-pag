const { Notificacion, Usuario } = require('../Models');

async function isConnected() {
  try {
    await Notificacion.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getNotifications() {
  try {
    const list = await Notificacion.findAll({ include: [{ model: Usuario }] });
    return list.map(n => n.toJSON());
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return [];
  }
}

async function getNotificationsByUser(usuarioId) {
  try {
    const list = await Notificacion.findAll({ where: { usuario_id: usuarioId } });
    return list.map(n => n.toJSON());
  } catch (error) {
    console.error('Error al obtener notificaciones del usuario:', error);
    return [];
  }
}

async function createNotification(data) {
  try {
    const notif = await Notificacion.create(data);
    return notif.toJSON();
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
}

async function markAsRead(id) {
  try {
    const [rows] = await Notificacion.update({ leida: true }, { where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return false;
  }
}

async function deleteNotification(id) {
  try {
    const rows = await Notificacion.destroy({ where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return false;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Notificaciones' : '🔴 DB desconectada para Notificaciones');
})();

module.exports = {
  getNotifications,
  getNotificationsByUser,
  createNotification,
  markAsRead,
  deleteNotification
};