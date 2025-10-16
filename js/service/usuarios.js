const { Usuario, Suscripcion, Pago, Notificacion, Webhook } = require('../Models');
const encryptionService = require('../Utils/encryption');

async function isConnected() {
  try {
    await Usuario.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getUsers() {
  try {
    const users = await Usuario.findAll({
      include: [
        { model: Suscripcion, as: 'suscripciones' },
        { model: Pago, as: 'pagos' },
        { model: Notificacion, as: 'notificaciones' },
        { model: Webhook, as: 'webhooks' }
      ]
    });
    return users.map(u => {
      const { hash_password, ...rest } = u.toJSON();
      return rest;
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}

async function getUserById(id) {
  try {
    const user = await Usuario.findByPk(id, {
      include: [
        { model: Suscripcion, as: 'suscripciones' },
        { model: Pago, as: 'pagos' },
        { model: Notificacion, as: 'notificaciones' },
        { model: Webhook, as: 'webhooks' }
      ]
    });
    if (!user) return null;
    const { hash_password, ...rest } = user.toJSON();
    return rest;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

async function createUser(data) {
  try {
    if (data.email) {
      const exists = await Usuario.findOne({ where: { email: data.email } });
      if (exists) throw new Error('El email ya está registrado');
    }
    if (data.password) {
      data.hash_password = await encryptionService.hashPassword(data.password);
      delete data.password;
    }
    const user = await Usuario.create(data);
    const { hash_password, ...rest } = user.toJSON();
    return rest;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

async function updateUser(id, data) {
  try {
    if (data.email) {
      const existing = await Usuario.findOne({
        where: { email: data.email, id: { [Usuario.sequelize.Op.ne]: id } }
      });
      if (existing) throw new Error('El email ya está en uso por otro usuario');
    }
    if (data.password) {
      data.hash_password = await encryptionService.hashPassword(data.password);
      delete data.password;
    }
    const [rows] = await Usuario.update(data, { where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return false;
  }
}

async function validateUser({ email, password }) {
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return null;
    const ok = await encryptionService.verifyPassword(password, user.hash_password);
    if (!ok) return null;
    const { hash_password, ...rest } = user.toJSON();
    return rest;
  } catch (error) {
    console.error('Error al validar usuario:', error);
    return null;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Usuarios (service global)' : '🔴 DB desconectada para Usuarios (service global)');
})();

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  validateUser
};