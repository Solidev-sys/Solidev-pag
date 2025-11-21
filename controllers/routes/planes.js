const express = require('express');
const planService = require('../../js/service/plan');

module.exports = function createPlanesRouter({ ensureAuth, ensureRole, preapprovalPlan, ngrok }) {
    const router = express.Router();

    // Público: listar planes y detalles
    router.get('/planes', async (req, res) => {
        try {
            const list = await planService.getPlans();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar planes' });
        }
    });

    // Público: obtener plan por ID
    router.get('/planes/:id', async (req, res) => {
        try {
            const plan = await planService.getPlanById(req.params.id);
            if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
            res.json(plan);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener plan' });
        }
    });

    // Admin: crear plan
    router.post('/planes', ensureRole('admin'), async (req, res) => {
        try {
            const created = await planService.createPlan(req.body);
            res.status(201).json({ message: 'Plan creado', plan: created });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al crear plan' });
        }
    });

    // Admin: actualizar plan
    router.put('/planes/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await planService.updatePlan(req.params.id, req.body);
            res.json({ updated: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al actualizar plan' });
        }
    });

    // Admin: eliminar plan
    router.delete('/planes/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await planService.deletePlan(req.params.id);
            res.json({ deleted: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al eliminar plan' });
        }
    });

    router.post('/planes/:id/sync-mercadopago', ensureRole('admin'), async (req, res) => {
        try {
            const backUrl = (ngrok || '') + '/api/suscripcion-exitosa';
            const id = await planService.syncMercadoPagoPlan({ planId: req.params.id, preapprovalPlan, backUrl });
            res.status(201).json({ message: 'Plan sincronizado con Mercado Pago', preapproval_plan_id: id });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al sincronizar plan con Mercado Pago' });
        }
    });

    return router;
};