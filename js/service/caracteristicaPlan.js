const { CaracteristicaPlan, Plan } = require('../Models');

async function isConnected() {
  try {
    await CaracteristicaPlan.sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

async function getFeaturesByPlan(planId) {
  try {
    const list = await CaracteristicaPlan.findAll({
      where: { plan_id: planId },
      include: [{ model: Plan }]
    });
    return list.map(f => f.toJSON());
  } catch (error) {
    console.error('Error al listar características por plan:', error);
    return [];
  }
}

async function getFeatureById(id) {
  try {
    const feature = await CaracteristicaPlan.findByPk(id, { include: [{ model: Plan }] });
    return feature ? feature.toJSON() : null;
  } catch (error) {
    console.error('Error al obtener característica:', error);
    return null;
  }
}

async function createFeature(data) {
  try {
    const feature = await CaracteristicaPlan.create(data);
    return feature.toJSON();
  } catch (error) {
    console.error('Error al crear característica:', error);
    throw error;
  }
}

async function updateFeature(id, data) {
  try {
    const [rows] = await CaracteristicaPlan.update(data, { where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al actualizar característica:', error);
    return false;
  }
}

async function deleteFeature(id) {
  try {
    const rows = await CaracteristicaPlan.destroy({ where: { id } });
    return rows > 0;
  } catch (error) {
    console.error('Error al eliminar característica:', error);
    return false;
  }
}

(async () => {
  const connected = await isConnected();
  console.log(connected ? '🟢 DB conectada para Características de Plan' : '🔴 DB desconectada para Características de Plan');
})();

module.exports = {
  getFeaturesByPlan,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature
};