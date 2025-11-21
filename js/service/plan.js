const { Plan, CaracteristicaPlan } = require('../Models');

async function isConnected() {
  try {
    await Plan.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getPlans() {
  try {
    const plans = await Plan.findAll({
      include: [{ model: CaracteristicaPlan, as: 'caracteristicas' }]
    });
    return plans.map(p => p.toJSON());
  } catch (error) {
    console.error('Error al obtener planes:', error);
    return [];
  }
}

async function getPlanById(id) {
  try {
    const plan = await Plan.findByPk(id, {
      include: [{ model: CaracteristicaPlan, as: 'caracteristicas' }]
    });
    return plan ? plan.toJSON() : null;
  } catch (error) {
    console.error('Error al obtener plan:', error);
    return null;
  }
}

async function createPlan(data) {
  try {
    if (!data || typeof data !== 'object') throw new Error('Datos de plan inválidos')
    const required = ['codigo','nombre','precio_centavos','moneda','ciclo_fact']
    for (const k of required) { if (data[k] === undefined || data[k] === null || data[k] === '') throw new Error(`Campo requerido faltante: ${k}`) }
    if (typeof data.precio_centavos !== 'number' || data.precio_centavos <= 0) throw new Error('precio_centavos debe ser número > 0')
    if (typeof data.moneda !== 'string' || data.moneda.length !== 3) throw new Error('moneda debe ser código de 3 letras')
    if (!['mensual','anual'].includes(data.ciclo_fact)) throw new Error('ciclo_fact debe ser mensual o anual')
    if (data.codigo) {
      const exists = await Plan.findOne({ where: { codigo: data.codigo } });
      if (exists) throw new Error('El código de plan ya existe');
    }
    const plan = await Plan.create(data);
    return plan.toJSON();
  } catch (error) {
    console.error('Error al crear plan:', error);
    throw error;
  }
}

async function updatePlan(id, data) {
  try {
    if (data.codigo) {
      const existing = await Plan.findOne({
        where: { codigo: data.codigo, id: { [Plan.sequelize.Op.ne]: id } }
      });
      if (existing) throw new Error('El código de plan ya está en uso por otro plan');
    }
    const [rows] = await Plan.update(data, { where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    return false;
  }
}

async function deletePlan(id) {
  try {
    const rows = await Plan.destroy({ where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    return false;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Planes' : '🔴 DB desconectada para Planes');
  if (connected) {
    try { await ensureMpPlanColumn(); } catch {}
  }
})();

async function ensureMpPlanColumn() {
  try {
    const qi = Plan.sequelize.getQueryInterface();
    const desc = await qi.describeTable('planes');
    if (!desc.mp_preapproval_plan_id) {
      await Plan.sequelize.query("ALTER TABLE planes ADD COLUMN mp_preapproval_plan_id VARCHAR(64) NULL UNIQUE");
    }
  } catch (error) {}
}

async function syncMercadoPagoPlan({ planId, preapprovalPlan, backUrl }) {
  await ensureMpPlanColumn();
  const plan = await Plan.findByPk(planId);
  if (!plan) throw new Error('Plan no encontrado');
  if (!plan.nombre || !plan.codigo) throw new Error('Plan sin nombre o código');
  if (!plan.precio_centavos || plan.precio_centavos <= 0) throw new Error('Plan con precio inválido');
  if (!plan.moneda || plan.moneda.length !== 3) throw new Error('Plan con moneda inválida');
  if (!['mensual','anual'].includes(plan.ciclo_fact)) throw new Error('Plan con ciclo inválido');
  const body = {
    reason: plan.nombre || `Plan ${plan.codigo}`,
    auto_recurring: {
      frequency: plan.ciclo_fact === 'anual' ? 12 : 1,
      frequency_type: 'months',
      transaction_amount: plan.precio_centavos / 100,
      currency_id: plan.moneda || 'CLP'
    },
    back_url: backUrl || ''
  };
  try {
    console.info('Sincronizando plan con Mercado Pago', { planId, body })
    const resp = await preapprovalPlan.create({ body });
    if (!resp || !resp.id) {
      console.error('Respuesta inválida de Mercado Pago al crear plan', { resp })
      throw new Error('Respuesta inválida de Mercado Pago')
    }
    await Plan.update({ mp_preapproval_plan_id: resp.id }, { where: { id: plan.id } });
    console.info('Plan sincronizado con Mercado Pago', { planId, mp_preapproval_plan_id: resp.id })
    return resp.id;
  } catch (err) {
    console.error('Fallo al sincronizar plan con Mercado Pago', { planId, error: err?.message || String(err) })
    throw err
  }
}

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  syncMercadoPagoPlan,
  ensureMpPlanColumn
};