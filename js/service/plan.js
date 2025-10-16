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
})();

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
};