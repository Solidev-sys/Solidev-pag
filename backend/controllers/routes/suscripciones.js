const express = require('express');
const { Suscripcion } = require('../../js/Models');
const suscripcionService = require('../../js/service/suscripcion');

module.exports = function createSuscripcionesRouter({ ensureAuth, ensureRole }) {
    const router = express.Router();

    // Admin: listar todas las suscripciones
    router.get('/suscripciones', ensureRole('admin'), async (req, res) => {
        try {
            const list = await suscripcionService.getSubscriptions();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar suscripciones' });
        }
    });

    // Auth: obtener una suscripción (propietario o admin)
    router.get('/suscripciones/:id', ensureAuth, async (req, res) => {
        try {
            const sub = await suscripcionService.getSubscriptionById(req.params.id);
            if (!sub) return res.status(404).json({ error: 'Suscripción no encontrada' });
            if (req.role !== 'admin' && sub.usuario_id !== req.userId) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            res.json(sub);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener suscripción' });
        }
    });

    // Auth: crear suscripción para el usuario autenticado
    router.post('/suscripciones', ensureAuth, async (req, res) => {
        try {
            const { plan_id, fecha_inicio, proximo_cobro } = req.body;
            if (!plan_id) return res.status(400).json({ error: 'Falta plan_id' });

            const created = await suscripcionService.createSubscription({
                usuario_id: req.userId,
                plan_id,
                fecha_inicio: fecha_inicio || null,
                proximo_cobro: proximo_cobro || null
            });
            res.status(201).json(created);
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al crear suscripción' });
        }
    });

    // Auth: actualizar suscripción (propietario o admin)
    router.put('/suscripciones/:id', ensureAuth, async (req, res) => {
        try {
            const sub = await Suscripcion.findByPk(req.params.id);
            if (!sub) return res.status(404).json({ error: 'Suscripción no encontrada' });
            if (req.role !== 'admin' && sub.usuario_id !== req.userId) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            const ok = await suscripcionService.updateSubscription(req.params.id, req.body);
            res.json({ updated: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al actualizar suscripción' });
        }
    });

    // Auth: cancelar suscripción (propietario o admin)
    router.post('/suscripciones/:id/cancelar', ensureAuth, async (req, res) => {
        try {
            const sub = await Suscripcion.findByPk(req.params.id);
            if (!sub) return res.status(404).json({ error: 'Suscripción no encontrada' });
            if (req.role !== 'admin' && sub.usuario_id !== req.userId) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            const ok = await suscripcionService.cancelSubscription(req.params.id, req.body.motivo);
            res.json({ canceled: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al cancelar suscripción' });
        }
    });

    return router;
};