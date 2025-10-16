const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const PaginaSitio = sequelize.define('PaginaSitio', {
  slug: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  titulo: { type: DataTypes.STRING(120), allowNull: false },
  hero_titulo: { type: DataTypes.STRING(160), allowNull: true },
  hero_texto: { type: DataTypes.STRING(500), allowNull: true },
  tema_color: { type: DataTypes.STRING(64), allowNull: false, defaultValue: 'azul_verde_suave' }
}, {
  tableName: 'paginas_sitio',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = PaginaSitio;