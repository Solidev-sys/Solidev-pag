// Archivo: Usuario.js (definición del modelo)
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
// ... existing code ...
const Usuario = sequelize.define('Usuario', {
  email: {
    type: DataTypes.STRING(191),
    allowNull: false,
    unique: true,
    validate: { isEmail: { msg: 'Debe ser un email válido' } }
  },
  hash_password: { type: DataTypes.STRING(255), allowNull: false },
  nombre_completo: { type: DataTypes.STRING(120), allowNull: true },
  telefono: { type: DataTypes.STRING(30), allowNull: true },
  estado: {
    type: DataTypes.ENUM('activo','bloqueado','pendiente'),
    allowNull: false,
    defaultValue: 'activo'
  },
  rol: {
    type: DataTypes.ENUM('cliente','admin'),
    allowNull: false,
    defaultValue: 'cliente'
  },
  mp_customer_id: { type: DataTypes.STRING(64), allowNull: true }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});
// ... existing code ...
module.exports = Usuario;