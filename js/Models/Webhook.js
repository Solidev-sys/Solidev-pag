const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Webhook = sequelize.define('Webhook', {
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: { model: 'usuarios', key: 'id' }
  },
  proveedor: { type: DataTypes.ENUM('mercadopago'), allowNull: false },
  topico: { type: DataTypes.STRING(64), allowNull: false },
  id_externo: { type: DataTypes.STRING(64), allowNull: true },
  id_evento: { type: DataTypes.STRING(64), allowNull: true },
  recibido_en: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  payload: { type: DataTypes.JSON, allowNull: false },
  procesado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  procesado_en: { type: DataTypes.DATE, allowNull: true },
  error_proceso: { type: DataTypes.STRING(255), allowNull: true }
}, {
  tableName: 'webhooks',
  timestamps: false,
  indexes: [
    { name: 'idx_wh_usuario', fields: ['usuario_id'] },
    { name: 'idx_wh_topico_ext', fields: ['topico', 'id_externo'] },
    { name: 'idx_wh_procesado', fields: ['procesado'] }
  ]
});

module.exports = Webhook;