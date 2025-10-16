const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const CaracteristicaPlan = sequelize.define('CaracteristicaPlan', {
  plan_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'planes', key: 'id' }
  },
  etiqueta: { type: DataTypes.STRING(160), allowNull: false },
  posicion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  }
}, {
  tableName: 'caracteristicas_plan',
  timestamps: false,
  indexes: [
    { name: 'uq_plan_posicion', unique: true, fields: ['plan_id', 'posicion'] }
  ]
});

module.exports = CaracteristicaPlan;