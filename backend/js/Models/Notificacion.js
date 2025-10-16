const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Notificacion = sequelize.define('Notificacion', {
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }
  },
  tipo: {
    type: DataTypes.ENUM('pago_fallido','pago_pendiente','pago_exitoso','suscripcion_cancelada'),
    allowNull: false
  },
  canal: {
    type: DataTypes.ENUM('email','whatsapp','sms','in_app'),
    allowNull: false,
    defaultValue: 'email'
  },
  mensaje: { type: DataTypes.STRING(500), allowNull: false },
  id_relacionado: { type: DataTypes.BIGINT, allowNull: true },
  leida: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  enviada_en: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'notificaciones',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false,
  indexes: [
    { name: 'idx_notif_usuario_fecha', fields: ['usuario_id', 'creado_en'] },
    { name: 'idx_notif_no_leidas', fields: ['leida'] }
  ]
});

module.exports = Notificacion;