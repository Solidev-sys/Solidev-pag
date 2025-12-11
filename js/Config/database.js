// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: process.env.SQL_DEBUG === 'true' ? (msg) => console.debug(msg) : false,
    logQueryParameters: false
  }
);

module.exports = sequelize;
