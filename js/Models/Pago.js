const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Pago = sequelize.define('Pago', {
  suscripcion_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'suscripciones', key: 'id' }
  },
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }
  },
  mp_payment_id: { type: DataTypes.STRING(64), allowNull: true, unique: true },
  estado: {
    type: DataTypes.ENUM('pendiente','aprobado','autorizado','en_proceso','rechazado','reembolsado','contracargo','cancelado'),
    allowNull: false
  },
  monto_centavos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  moneda: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'CLP',
    validate: { len: [3, 3] }
  },
  intento_n: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  pagado_en: { type: DataTypes.DATE, allowNull: true },
  motivo_fallo: { type: DataTypes.STRING(255), allowNull: true },
  payload_crudo: { type: DataTypes.JSON, allowNull: true }
}, {
  tableName: 'pagos',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  indexes: [
    { name: 'idx_pagos_usuario_fecha', fields: ['usuario_id', 'creado_en'] },
    { name: 'idx_pagos_subs_fecha', fields: ['suscripcion_id', 'creado_en'] },
    { name: 'idx_pagos_estado', fields: ['estado'] }
  ]
});

module.exports = Pago;