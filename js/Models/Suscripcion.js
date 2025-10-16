const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Suscripcion = sequelize.define('Suscripcion', {
  usuario_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }
  },
  plan_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'planes', key: 'id' }
  },
  estado: {
    type: DataTypes.ENUM('pendiente','autorizada','activa','pausada','cancelada','expirada'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  mp_preapproval_id: { type: DataTypes.STRING(64), allowNull: true, unique: true },
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
  proximo_cobro: { type: DataTypes.DATEONLY, allowNull: true },
  motivo_cancelacion: { type: DataTypes.STRING(255), allowNull: true },
  cancelada_en: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'suscripciones',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  indexes: [
    { name: 'idx_subs_usuario', fields: ['usuario_id'] },
    { name: 'idx_subs_plan', fields: ['plan_id'] }
  ]
});

module.exports = Suscripcion;