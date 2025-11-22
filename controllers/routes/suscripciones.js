const express = require('express');
const { Suscripcion } = require('../../js/Models');
const suscripcionService = require('../../js/service/suscripcion');

module.exports = function createSuscripcionesRouter({ ensureAuth, ensureRole, preapproval, preapprovalPlan, ngrok }) {
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

    // Auth: iniciar suscripción en Mercado Pago (preaprobación)
    router.post('/suscripciones/:id/iniciar', ensureAuth, async (req, res) => {
        try {
            const usuario_id = req.userId;
            const suscripcion = await Suscripcion.findByPk(req.params.id);
            if (!suscripcion) return res.status(404).json({ error: 'Suscripción no encontrada' });
            if (req.role !== 'admin' && suscripcion.usuario_id !== usuario_id) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            const plan = await require('../../js/Models').Plan.findByPk(suscripcion.plan_id);
            const usuario = await require('../../js/Models').Usuario.findByPk(usuario_id);
            if (!plan || !usuario) return res.status(404).json({ error: 'Datos de plan/usuario no disponibles' });
            const accessToken = process.env.MP_ACCESS_TOKEN || process.env.Access_token;
            if (!accessToken) return res.status(500).json({ message: 'Token de Mercado Pago no configurado', error_code: 'SUB_MP_TOKEN_MISSING' });
            if (!usuario.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) return res.status(400).json({ message: 'Email del comprador inválido', error_code: 'SUB_EMAIL_INVALID' });
            if (!plan.moneda || plan.moneda.length !== 3) return res.status(400).json({ message: 'Moneda inválida', error_code: 'SUB_CURRENCY_INVALID' });
            const allowedCurrencies = new Set(['CLP','ARS','BRL','COP','MXN','USD']);
            if (!allowedCurrencies.has((plan.moneda || '').toUpperCase())) return res.status(400).json({ message: 'Moneda no soportada por Mercado Pago', error_code: 'SUB_CURRENCY_UNSUPPORTED' });

            if (!plan.mp_preapproval_plan_id) {
                if (!plan.nombre || !plan.codigo) return res.status(400).json({ error: 'Plan sin nombre o código' })
                if (!plan.precio_centavos || plan.precio_centavos <= 0) return res.status(400).json({ error: 'Plan con precio inválido' })
                if (!plan.moneda || plan.moneda.length !== 3) return res.status(400).json({ error: 'Plan con moneda inválida' })
                if (!['mensual','anual'].includes(plan.ciclo_fact)) return res.status(400).json({ error: 'Plan con ciclo inválido' })
                const backUrl = (ngrok || '') + '/api/suscripcion-exitosa';
                const body = {
                    reason: plan.nombre || `Plan ${plan.codigo}`,
                    auto_recurring: {
                        frequency: plan.ciclo_fact === 'anual' ? 12 : 1,
                        frequency_type: 'months',
                        transaction_amount: plan.precio_centavos / 100,
                        currency_id: plan.moneda || 'CLP'
                    },
                    back_url: backUrl
                }
                try {
                    const id = await preapprovalPlan.create({ body });
                    if (!id || !id.id) return res.status(502).json({ error: 'Respuesta inválida de Mercado Pago' })
                    await require('../../js/Models').Plan.update({ mp_preapproval_plan_id: id.id }, { where: { id: plan.id } });
                    plan.mp_preapproval_plan_id = id.id;
                } catch (e) {
                    return res.status(502).json({ error: e?.message || 'Error al crear plan en Mercado Pago' })
                }
            }

            const { card_token_id } = req.body;
            if (!card_token_id) return res.status(400).json({ error: 'Falta card_token_id' });

            const preapprovalBody = {
                preapproval_plan_id: plan.mp_preapproval_plan_id,
                reason: plan.nombre || `Suscripción ${plan.codigo}`,
                external_reference: `${usuario_id}:${suscripcion.id}`,
                payer_email: usuario.email,
                card_token_id,
                auto_recurring: {
                    currency_id: plan.moneda || 'CLP'
                },
                back_url: (ngrok || '') + '/api/suscripcion-exitosa',
                status: 'authorized'
            };

            const resp = await preapproval.create({ body: preapprovalBody });
            
            await suscripcionService.updateSubscription(suscripcion.id, {
                mp_preapproval_id: resp.id,
                estado: 'pendiente'
            });

            res.status(201).json({ preapproval_id: resp.id });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al iniciar suscripción' });
        }
    });

    // Auth: callback de suscripción exitosa (actualiza estado)
    router.get('/suscripcion-exitosa', ensureAuth, async (req, res) => {
        try {
            const usuario_id = req.userId;
            const preapproval_id = req.query.preapproval_id;
            if (!preapproval_id) return res.status(400).json({ error: 'Falta preapproval_id' });

            const sub = await Suscripcion.findOne({ where: { mp_preapproval_id: preapproval_id, usuario_id } });
            if (!sub) return res.status(404).json({ error: 'Suscripción no encontrada para el usuario' });

            let status = 'pendiente';
            try {
                const p = await preapproval.get({ id: preapproval_id });
                status = (p.status === 'authorized' || p.status === 'active') ? 'autorizada' : 'pendiente';
            } catch {}

            const fecha_inicio = new Date();
            const next = new Date(fecha_inicio);
            if (sub.plan_id) {
                const plan = await require('../../js/Models').Plan.findByPk(sub.plan_id);
                if (plan?.ciclo_fact === 'anual') next.setFullYear(next.getFullYear() + 1); else next.setMonth(next.getMonth() + 1);
            } else {
                next.setMonth(next.getMonth() + 1);
            }

            await suscripcionService.updateSubscription(sub.id, {
                estado: status,
                fecha_inicio,
                proximo_cobro: next
            });

            res.json({ ok: true, estado: status });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al confirmar suscripción' });
        }
    });

    return router;
};
