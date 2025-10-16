const express = require('express');
const featureService = require('../../js/service/caracteristicaPlan');

module.exports = function createCaracteristicasRouter({ ensureAuth, ensureRole }) {
    const router = express.Router();

    // Público: listar características por plan
    router.get('/planes/:planId/caracteristicas', async (req, res) => {
        try {
            const list = await featureService.getFeaturesByPlan(req.params.planId);
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar características' });
        }
    });

    // Público: obtener característica por ID
    router.get('/caracteristicas/:id', async (req, res) => {
        try {
            const feature = await featureService.getFeatureById(req.params.id);
            if (!feature) return res.status(404).json({ error: 'Característica no encontrada' });
            res.json(feature);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener característica' });
        }
    });

    // Admin: crear característica
    router.post('/caracteristicas', ensureRole('admin'), async (req, res) => {
        try {
            const created = await featureService.createFeature(req.body);
            res.status(201).json(created);
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al crear característica' });
        }
    });

    // Admin: actualizar característica
    router.put('/caracteristicas/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await featureService.updateFeature(req.params.id, req.body);
            res.json({ updated: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al actualizar característica' });
        }
    });

    // Admin: eliminar característica
    router.delete('/caracteristicas/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await featureService.deleteFeature(req.params.id);
            res.json({ deleted: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al eliminar característica' });
        }
    });

    return router;
};