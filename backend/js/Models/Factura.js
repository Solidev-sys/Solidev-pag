const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Factura = sequelize.define('Factura', {
  pago_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    references: { model: 'pagos', key: 'id' }
  },
  numero: { type: DataTypes.STRING(64), allowNull: false },
  ruta_pdf: { type: DataTypes.STRING(255), allowNull: false },
  emitida_en: { type: DataTypes.DATE, allowNull: false },
  impuesto_cent: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
  neto_cent: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
  total_cent: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } }
}, {
  tableName: 'facturas',
  timestamps: false,
  hooks: {
    // Impedir emitir factura si el pago no está aprobado (refleja el trigger SQL)
    beforeCreate: async (factura, options) => {
      const Pago = sequelize.models.Pago;
      const pago = await Pago.findByPk(factura.pago_id, { transaction: options?.transaction });
      if (!pago) {
        throw new Error('No se puede emitir factura: el pago no existe');
      }
      if (pago.estado !== 'aprobado') {
        throw new Error('No se puede emitir factura: el pago no está aprobado');
      }
    }
  }
});

module.exports = Factura;