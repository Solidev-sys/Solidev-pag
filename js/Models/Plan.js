const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Plan = sequelize.define('Plan', {
  codigo: { type: DataTypes.STRING(32), allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(64), allowNull: false },
  precio_centavos: {
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
  dias_prueba_gratis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  ciclo_fact: {
    type: DataTypes.ENUM('mensual', 'anual'),
    allowNull: false,
    defaultValue: 'mensual'
  },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  mensaje_rapido: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  mensaje_seguro: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  resumen: { type: DataTypes.STRING(255), allowNull: true },
  enlace_imagen: { type: DataTypes.STRING(255), allowNull: true }
  , mp_preapproval_plan_id: { type: DataTypes.STRING(64), allowNull: true, unique: true }
}, {
  tableName: 'planes',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Plan;
