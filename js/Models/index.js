// Importaciones de nuevos modelos
const sequelize = require('../Config/database');
const Usuario = require('./Usuario');
const Plan = require('./Plan');
const CaracteristicaPlan = require('./CaracteristicaPlan');
const Suscripcion = require('./Suscripcion');
const Pago = require('./Pago');
const Factura = require('./Factura');
const Webhook = require('./Webhook');
const Notificacion = require('./Notificacion');
const PaginaSitio = require('./PaginaSitio');

// Planes y características
Plan.hasMany(CaracteristicaPlan, { foreignKey: 'plan_id', as: 'caracteristicas', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
CaracteristicaPlan.belongsTo(Plan, { foreignKey: 'plan_id' });

// Usuarios y suscripciones
Usuario.hasMany(Suscripcion, { foreignKey: 'usuario_id', as: 'suscripciones', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
Suscripcion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Planes y suscripciones
Plan.hasMany(Suscripcion, { foreignKey: 'plan_id', as: 'suscripciones', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
Suscripcion.belongsTo(Plan, { foreignKey: 'plan_id' });

// Pagos y suscripciones/usuarios
Suscripcion.hasMany(Pago, { foreignKey: 'suscripcion_id', as: 'pagos', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
Pago.belongsTo(Suscripcion, { foreignKey: 'suscripcion_id' });

Usuario.hasMany(Pago, { foreignKey: 'usuario_id', as: 'pagos', onUpdate: 'CASCADE', onDelete: 'RESTRICT' });
Pago.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Facturas y pagos
Pago.hasOne(Factura, { foreignKey: 'pago_id', as: 'factura', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Factura.belongsTo(Pago, { foreignKey: 'pago_id', as: 'pago' });

// Notificaciones y usuarios
Usuario.hasMany(Notificacion, { foreignKey: 'usuario_id', as: 'notificaciones', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Webhooks: sin relaciones directas
Usuario.hasMany(Webhook, { foreignKey: 'usuario_id', as: 'webhooks', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Webhook.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Exportación
module.exports = {
  sequelize,
  Usuario,
  Plan,
  CaracteristicaPlan,
  Suscripcion,
  Pago,
  Factura,
  Webhook,
  Notificacion,
  PaginaSitio
};
