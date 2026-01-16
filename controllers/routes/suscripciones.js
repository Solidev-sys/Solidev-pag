const express = require('express');
const { Suscripcion } = require('../../js/Models');
const suscripcionService = require('../../js/service/suscripcion');
const planService = require('../../js/service/plan');
const { getMercadoPagoAccessToken } = require('../services/mercadopago');
const { validateMpCardTokenId, buildMpIdempotencyKey } = require('../utils/mercadopagoSecurity');

module.exports = function createSuscripcionesRouter({ ensureAuth, ensureRole, preapproval, preapprovalPlan, ngrok }) {
    const router = express.Router();
    const isProduction = process.env.NODE_ENV === 'production';
    const sanitizeEmail = (value) => String(value || '').replace(/[\r\n]/g, '').trim();
    const nowIso = () => new Date().toISOString();
    const normalizeMpError = (value) => {
        if (!value) return null;
        if (Array.isArray(value)) return value;
        if (typeof value === 'object') {
            try { return JSON.parse(JSON.stringify(value)); } catch { return Object.fromEntries(Object.entries(value)); }
        }
        return value;
    };

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

            // Verificar si ya existe una suscripción pendiente para este usuario y plan
            const existingSub = await Suscripcion.findOne({ 
                where: { 
                    usuario_id: req.userId, 
                    plan_id, 
                    estado: 'pendiente' 
                } 
            });

            if (existingSub) {
                // Si existe, actualizamos fechas si se proveen, o la devolvemos tal cual
                if (fecha_inicio || proximo_cobro) {
                    await suscripcionService.updateSubscription(existingSub.id, {
                        fecha_inicio: fecha_inicio || existingSub.fecha_inicio,
                        proximo_cobro: proximo_cobro || existingSub.proximo_cobro
                    });
                }
                return res.status(200).json(existingSub);
            }

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
            try { await planService.ensurePlanColumns(); } catch {}
            const plan = await require('../../js/Models').Plan.findByPk(suscripcion.plan_id);
            const usuario = await require('../../js/Models').Usuario.findByPk(usuario_id);
            if (!plan || !usuario) return res.status(404).json({ error: 'Datos de plan/usuario no disponibles' });
            const accessToken = getMercadoPagoAccessToken();
            if (!accessToken) return res.status(500).json({ message: 'Token de Mercado Pago no configurado', error_code: 'SUB_MP_TOKEN_MISSING' });
            const isTestToken = /^TEST-/.test(String(accessToken || ''));
            const envTestPayer = sanitizeEmail(process.env.MP_TEST_PAYER_EMAIL);
            const payerEmail = ((isTestToken || !isProduction) && envTestPayer && envTestPayer.includes('@')) ? envTestPayer : sanitizeEmail(usuario.email);
            if (!payerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payerEmail)) return res.status(400).json({ message: 'Email del comprador inválido', error_code: 'SUB_EMAIL_INVALID' });
            if (!plan.moneda || plan.moneda.length !== 3) return res.status(400).json({ message: 'Moneda inválida', error_code: 'SUB_CURRENCY_INVALID' });
            const forcedCurrency = String(process.env.MP_CURRENCY_ID || '').trim().toUpperCase();
            if (forcedCurrency && (plan.moneda || '').toUpperCase() !== forcedCurrency) {
                return res.status(400).json({ message: `Moneda del plan incompatible con Mercado Pago (${forcedCurrency})`, error_code: 'SUB_CURRENCY_MISMATCH' });
            }
            const allowedCurrencies = new Set(['CLP', 'ARS', 'BRL', 'COP', 'MXN', 'USD']);
            if (!allowedCurrencies.has((plan.moneda || '').toUpperCase())) return res.status(400).json({ message: 'Moneda no soportada por Mercado Pago', error_code: 'SUB_CURRENCY_UNSUPPORTED' });

            const rawCardTokenId = req.body?.card_token_id;
            const cardTokenCheck = validateMpCardTokenId(rawCardTokenId);
            const cardTokenId = cardTokenCheck.ok ? cardTokenCheck.value : '';
            const freeTrialDays = Number.isFinite(Number(plan.dias_prueba_gratis))
                ? Number(plan.dias_prueba_gratis)
                : Number(process.env.MP_FREE_TRIAL_DAYS || 0);
            const baseUrl = ngrok || process.env.URL_HTTPS || `http://localhost:${process.env.HTTP_PORT || 3002}`;
            const backUrl = `${baseUrl}/api/suscripcion-exitosa`;
            const webhookToken = String(process.env.WEBHOOK_TOKEN || '').trim();
            const notificationUrl = `${baseUrl}/api/webhook-mercadopago${webhookToken ? `?token=${encodeURIComponent(webhookToken)}` : ''}`;

            if (process.env.REQUEST_LOG === 'true') {
                console.log('SUB iniciar', {
                    request_id: req.requestId || null,
                    usuario_id,
                    suscripcion_id: suscripcion.id,
                    plan_id: plan.id,
                    modo: cardTokenId ? 'token' : 'redirect',
                    has_preapproval_id: Boolean(suscripcion.mp_preapproval_id),
                    at: nowIso()
                });
            }

            if (suscripcion.mp_preapproval_id) {
                try {
                    const p = await preapproval.get({
                        id: suscripcion.mp_preapproval_id,
                        requestOptions: { timeout: 3000, retries: 0 }
                    });
                    const initPoint = p?.init_point || null;
                    const sandboxInitPoint = p?.sandbox_init_point || null;
                    const chosen = (isProduction ? (initPoint || sandboxInitPoint) : (sandboxInitPoint || initPoint)) || null;
                    return res.status(200).json({
                        preapproval_id: suscripcion.mp_preapproval_id,
                        init_point: chosen,
                        init_point_prod: initPoint,
                        init_point_test: sandboxInitPoint
                    });
                } catch {}
                return res.status(200).json({ preapproval_id: suscripcion.mp_preapproval_id, init_point: null });
            }

            const preapprovalBody = {
                reason: plan.nombre || `Suscripción ${plan.codigo}`,
                external_reference: `${usuario_id}:${suscripcion.id}`,
                payer_email: payerEmail,
                back_url: backUrl,
                notification_url: notificationUrl
            };

            if (cardTokenId) {
                preapprovalBody.auto_recurring = {
                    frequency: plan.ciclo_fact === 'anual' ? 12 : 1,
                    frequency_type: 'months',
                    transaction_amount: plan.precio_centavos / 100,
                    currency_id: plan.moneda || 'CLP'
                };
                if (Number.isFinite(freeTrialDays) && freeTrialDays > 0) {
                    preapprovalBody.auto_recurring.free_trial = { frequency: freeTrialDays, frequency_type: 'days' };
                }
                preapprovalBody.card_token_id = cardTokenId;
                preapprovalBody.status = 'authorized';
            } else if (rawCardTokenId !== undefined && !cardTokenCheck.ok) {
                return res.status(400).json({ message: 'card_token_id inválido', error_code: 'SUB_CARD_TOKEN_INVALID' });
            } else {
                preapprovalBody.status = 'pending';
                preapprovalBody.auto_recurring = {
                    frequency: plan.ciclo_fact === 'anual' ? 12 : 1,
                    frequency_type: 'months',
                    transaction_amount: plan.precio_centavos / 100,
                    currency_id: plan.moneda || 'CLP'
                };
                if (Number.isFinite(freeTrialDays) && freeTrialDays > 0) {
                    preapprovalBody.auto_recurring.free_trial = { frequency: freeTrialDays, frequency_type: 'days' };
                }
            }

            let resp;
            try {
                const t0 = Date.now();
                const idempotencyKey = buildMpIdempotencyKey([suscripcion.id, usuario_id, plan.id, cardTokenId || 'redirect']);
                resp = await preapproval.create({
                    body: preapprovalBody,
                    requestOptions: { idempotencyKey, timeout: 8000, retries: 2 }
                });
                const ms = Date.now() - t0;
                if (process.env.REQUEST_LOG === 'true') {
                    console.log('MP preapproval.create OK', { request_id: req.requestId || null, ms, at: nowIso() });
                }
            } catch (e) {
                const status = e?.status || e?.statusCode || e?.response?.status || null;
                const mpData = normalizeMpError(e?.cause || e?.response?.data || null);
                console.error('SUB preapproval.create FAILED', {
                    request_id: req.requestId || null,
                    usuario_id,
                    suscripcion_id: suscripcion.id,
                    status,
                    has_card_token_id: Boolean(cardTokenId),
                    mp: mpData,
                    message: e?.message || null
                });
                return res.status(status || 502).json({
                    message: 'Error al iniciar suscripción en Mercado Pago',
                    error_code: 'SUB_MP_PREAPPROVAL_CREATE_FAILED',
                    details: {
                        status,
                        mp: mpData || null,
                        message: e?.message || null
                    }
                });
            }
            
            await suscripcionService.updateSubscription(suscripcion.id, {
                mp_preapproval_id: resp.id,
                estado: 'pendiente'
            });

            const initPoint = resp?.init_point || null;
            const sandboxInitPoint = resp?.sandbox_init_point || null;
            const chosen = (isProduction ? (initPoint || sandboxInitPoint) : (sandboxInitPoint || initPoint)) || null;

            console.log('SUB preapproval.create OK', {
                usuario_id,
                suscripcion_id: suscripcion.id,
                preapproval_id: resp?.id,
                has_init_point: Boolean(initPoint),
                has_sandbox_init_point: Boolean(sandboxInitPoint),
                has_card_token_id: Boolean(cardTokenId),
                chosen_host: chosen ? (() => { try { return new URL(chosen).hostname } catch { return null } })() : null
            });

            res.status(201).json({ preapproval_id: resp.id, init_point: chosen, init_point_prod: initPoint, init_point_test: sandboxInitPoint });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al iniciar suscripción' });
        }
    });

    // Callback de suscripción (actualiza estado) y redirige al frontend
    router.get('/suscripcion-exitosa', async (req, res) => {
        try {
            const wantsJson = String(req.headers?.accept || '').includes('application/json') || String(req.query?.format || '').toLowerCase() === 'json';
            const preapproval_id = req.query.preapproval_id;
            if (!preapproval_id) {
                if (wantsJson) return res.status(400).json({ error: 'Falta preapproval_id' });
                return res.status(400).send('Falta preapproval_id');
            }
            const frontUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

            let p;
            try { p = await preapproval.get({ id: preapproval_id }); } catch (e) {
                if (wantsJson) {
                    return res.status(502).json({ message: 'No se pudo verificar la suscripción', error_code: 'SUB_MP_PREAPPROVAL_GET_FAILED' });
                }
                return res.redirect(`${frontUrl}/payment/failed?reason=${encodeURIComponent('No se pudo verificar la suscripción')}`);
            }

            const ext = String(p.external_reference || '');
            const parts = ext.includes(':') ? ext.split(':') : [];
            const usuario_id = Number(parts[0]);
            const suscripcion_id = Number(parts[1]);
            if (!usuario_id || !suscripcion_id) {
                if (wantsJson) return res.status(400).json({ message: 'Datos de suscripción incompletos', error_code: 'SUB_EXTERNAL_REFERENCE_INVALID' });
                return res.redirect(`${frontUrl}/payment/failed?reason=${encodeURIComponent('Datos de suscripción incompletos')}`);
            }

            const sub = await Suscripcion.findOne({ where: { id: suscripcion_id, usuario_id } });
            if (!sub) {
                if (wantsJson) return res.status(404).json({ message: 'Suscripción no encontrada', error_code: 'SUB_NOT_FOUND' });
                return res.redirect(`${frontUrl}/payment/failed?reason=${encodeURIComponent('Suscripción no encontrada')}`);
            }

            const statusRaw = String(p.status || '').toLowerCase();
            const status = (statusRaw === 'authorized' || statusRaw === 'active') ? 'autorizada' : 'pendiente';

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

            if (status === 'autorizada') {
                if (wantsJson) return res.json({ ok: true, estado: status, preapproval_id: String(preapproval_id) });
                return res.redirect(`${frontUrl}/payment/success?${new URLSearchParams({ preapproval_id: String(preapproval_id) }).toString()}`);
            }
            if (wantsJson) return res.json({ ok: true, estado: status, preapproval_id: String(preapproval_id) });
            return res.redirect(`${frontUrl}/payment/pending?${new URLSearchParams({ preapproval_id: String(preapproval_id) }).toString()}`);
        } catch (err) {
            const frontUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            const wantsJson = String(req.headers?.accept || '').includes('application/json') || String(req.query?.format || '').toLowerCase() === 'json';
            if (wantsJson) return res.status(500).json({ message: 'Error al confirmar suscripción', error_code: 'SUB_CONFIRM_FAILED' });
            res.redirect(`${frontUrl}/payment/failed?reason=${encodeURIComponent('Error al confirmar suscripción')}`);
        }
    });

    return router;
};
