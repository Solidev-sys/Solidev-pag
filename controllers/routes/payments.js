// Módulo: createPaymentsRouter
const express = require('express');
const { Usuario, Suscripcion, Plan, Pago } = require('../../js/Models');
const { getMercadoPagoAccessToken } = require('../services/mercadopago');

module.exports = function createPaymentsRouter({
    ensureAuth,
    preference,
    ngrok
}) {
    const router = express.Router();
    const frontUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const isProduction = process.env.NODE_ENV === 'production';
    const sanitizeEmail = (value) => String(value || '').replace(/[\r\n]/g, '').trim();
    const nowIso = () => new Date().toISOString();

    // POST /api/pago: crea preferencia para una suscripción específica
    router.post('/pago', ensureAuth, async (req, res) => {
        try {
            const usuario_id = req.userId;
            const { suscripcion_id, items: clientItems, total } = req.body || {};
            const accessToken = getMercadoPagoAccessToken();
            if (!accessToken) return res.status(500).json({ message: 'Token de Mercado Pago no configurado', error_code: 'PAY_MP_TOKEN_MISSING' });
            const usuario = await Usuario.findByPk(usuario_id);
            if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado', error_code: 'PAY_USER_NOT_FOUND' });
            const envTestPayer = sanitizeEmail(process.env.MP_TEST_PAYER_EMAIL);
            const payerEmail = (!isProduction && envTestPayer && envTestPayer.includes('@')) ? envTestPayer : sanitizeEmail(usuario.email);
            if (!payerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payerEmail)) return res.status(400).json({ message: 'Email del comprador inválido', error_code: 'PAY_EMAIL_INVALID' });

            let items = [];
            let currency = 'CLP';
            let priceCentavos = 0;
            let planNombre = 'Compra';

            if (suscripcion_id) {
                const suscripcion = await Suscripcion.findByPk(suscripcion_id, { include: [{ model: Plan }] });
                if (!suscripcion || suscripcion.usuario_id !== usuario_id) return res.status(404).json({ message: 'Suscripción no encontrada o no pertenece al usuario', error_code: 'PAY_SUBS_NOT_FOUND' });

                const plan = await Plan.findByPk(suscripcion.plan_id);
                if (!plan) return res.status(404).json({ message: 'Plan no disponible', error_code: 'PAY_PLAN_NOT_FOUND' });
                if (!plan.activo) return res.status(400).json({ message: 'El plan no está activo', error_code: 'PAY_PLAN_INACTIVE' });
                if (!plan.moneda || plan.moneda.length !== 3) return res.status(400).json({ message: 'Moneda inválida', error_code: 'PAY_CURRENCY_INVALID' });
                const allowedCurrencies = new Set(['CLP','ARS','BRL','COP','MXN','USD']);
                if (!allowedCurrencies.has((plan.moneda || '').toUpperCase())) return res.status(400).json({ message: 'Moneda no soportada por Mercado Pago', error_code: 'PAY_CURRENCY_UNSUPPORTED' });
                if (!plan.precio_centavos || plan.precio_centavos <= 0) return res.status(400).json({ message: 'Monto inválido', error_code: 'PAY_AMOUNT_INVALID' });

                items = [{
                    id: suscripcion_id.toString(),
                    title: plan.nombre || `Suscripción ${plan.codigo}`,
                    description: `Pago de suscripción (${plan.ciclo_fact})`,
                    quantity: 1,
                    unit_price: plan.precio_centavos / 100,
                    currency_id: plan.moneda || 'CLP'
                }];
                currency = plan.moneda || 'CLP';
                priceCentavos = plan.precio_centavos;
                planNombre = plan.nombre || `Suscripción ${plan.codigo}`;
            } else if (Array.isArray(clientItems) && typeof total === 'number' && total > 0) {
                items = clientItems.map((it, idx) => ({
                    id: String(it.id ?? idx + 1),
                    title: String(it.name ?? `Item ${idx + 1}`),
                    description: 'Compra carrito',
                    quantity: Number(it.quantity ?? 1),
                    unit_price: Number(it.price ?? 0),
                    currency_id: String(it.currency_id ?? 'CLP')
                }));
                currency = (items[0]?.currency_id || 'CLP');
                priceCentavos = Math.round(total * 100);
                planNombre = 'Compra Carrito';
            } else {
                return res.status(400).json({ message: 'Faltan datos de suscripción o carrito', error_code: 'PAY_INPUT_MISSING' });
            }

            const payer = {
                name: usuario.nombre_completo || '',
                surname: '',
                email: payerEmail,
                phone: { area_code: '57', number: usuario.telefono || '0000000' },
                identification: { type: 'CC', number: 'N/A' },
                address: { street_name: 'N/A', street_number: 0, zip_code: '000000' }
            };

            const baseUrl = (ngrok && typeof ngrok === 'string' && ngrok.length > 0)
                ? ngrok
                : (process.env.URL_HTTPS || `http://localhost:${process.env.HTTP_PORT || 3002}`);
            const frontUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

            const preferenceData = {
                items,
                payer,
                back_urls: {
                    success: baseUrl + "/api/pago-exitoso",
                    failure: baseUrl + "/api/pago-fallido",
                    pending: baseUrl + "/api/pago-pendiente"
                },
                auto_return: "approved",
                external_reference: JSON.stringify({
                    u: usuario_id,
                    s: suscripcion_id || null,
                    p: priceCentavos,
                    m: currency,
                    n: planNombre
                }),
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 12
                },
                shipments: {
                    mode: "not_specified"
                },
                notification_url: ngrok ? (ngrok + "/api/webhook-mercadopago") : undefined
            };

            const t0 = Date.now();
            const response = await preference.create({ body: preferenceData });
            const ms = Date.now() - t0;
            if (process.env.REQUEST_LOG === 'true') {
                console.log('MP preference.create OK', { request_id: req.requestId || null, ms, at: nowIso() });
            }

            const initPoint = response?.init_point || null;
            const sandboxInitPoint = response?.sandbox_init_point || null;
            const preferSandbox = !isProduction && String(accessToken || '').startsWith('TEST-');
            const chosen = (preferSandbox ? (sandboxInitPoint || initPoint) : (initPoint || sandboxInitPoint)) || null;

            if (!chosen) {
                return res.status(502).json({ message: 'Respuesta inválida de Mercado Pago', error_code: 'PAY_INIT_POINT_MISSING' });
            }

            res.json({ init_point: chosen, init_point_prod: initPoint, init_point_test: sandboxInitPoint });
        } catch (error) {
            const msg = error?.message || 'Error al procesar el pago';
            const code = error?.code || 'PAY_PREFERENCE_FAILED';
            console.error('PAYMENT preference error', { request_id: req.requestId || null, message: msg, code, status: error?.status || error?.statusCode || null, mp: error?.cause || error?.response?.data || null });
            res.status(error?.status || 500).json({ message: msg, error_code: code });
        }
    });

    // GET /api/pago-exitoso: registra pago aprobado y redirige
    router.get('/pago-exitoso', async (req, res) => {
        const { payment_id, external_reference } = req.query;
        // userId puede venir de req.userId si hay cookie, pero mejor confiar en external_reference
        
        if (!payment_id || !external_reference) {
            return res.redirect(`${frontUrl}/payment/failed?reason=Datos%20de%20pago%20incompletos`);
        }

        try {
            // Recuperar contexto desde external_reference (stateless)
            let ctx;
            try {
                ctx = JSON.parse(external_reference);
            } catch (e) {
                console.error('Error parseando external_reference:', e);
                return res.redirect(`${frontUrl}/payment/failed?reason=Error%20de%20datos`);
            }

            const usuario_id = ctx.u;

            const existing = await Pago.findOne({ where: { mp_payment_id: payment_id } });
            if (existing) {
                const params = new URLSearchParams({
                    order_id: payment_id,
                    user_id: String(usuario_id),
                    subtotal: (existing.monto_centavos / 100).toFixed(2),
                    payment_id: payment_id,
                    item_name: ctx.n || 'Compra'
                });
                return res.redirect(`${frontUrl}/payment/success?${params.toString()}`);
            }

            const nuevoPago = await Pago.create({
                suscripcion_id: ctx.s,
                usuario_id: usuario_id,
                mp_payment_id: payment_id,
                estado: 'aprobado',
                monto_centavos: ctx.p,
                moneda: ctx.m || 'CLP',
                pagado_en: new Date()
            });

            const params = new URLSearchParams({
                order_id: payment_id,
                user_id: String(usuario_id),
                payment_id: payment_id,
                subtotal: (ctx.p / 100).toFixed(2),
                item_name: ctx.n
            });

            res.redirect(`${frontUrl}/payment/success?${params.toString()}`);
        } catch (error) {
            console.error("Error en pago-exitoso:", error);
            res.redirect(`${frontUrl}/payment/failed?reason=Error%20interno%20del%20servidor`);
        }
    });

    // GET /api/pago-fallido: registra intento fallido y redirige
    router.get('/pago-fallido', async (req, res) => {
        const payment_id = req.query.payment_id;
        const external_reference = req.query.external_reference;
        let ctx = null;
        if (external_reference) {
            try { ctx = JSON.parse(external_reference); } catch {}
        }
        try {
            if (payment_id && ctx?.u) {
                await Pago.create({
                    suscripcion_id: ctx.s,
                    usuario_id: ctx.u,
                    mp_payment_id: payment_id,
                    estado: 'rechazado',
                    monto_centavos: ctx.p,
                    moneda: ctx.m || 'CLP',
                    motivo_fallo: 'Pago rechazado por la entidad financiera'
                });
            }
        } catch (e) {
            console.error('Error registrando pago fallido:', e);
        }

        const params = new URLSearchParams({
            order_id: payment_id || `ORD-FAIL-${Date.now()}`,
            reason: 'Pago rechazado por la entidad financiera'
        });

        res.redirect(`${frontUrl}/payment/failed?${params.toString()}`);
    });

    // GET /api/pago-pendiente: registra intento pendiente y redirige
    router.get('/pago-pendiente', async (req, res) => {
        const payment_id = req.query.payment_id;
        const external_reference = req.query.external_reference;
        let ctx = null;
        if (external_reference) {
            try { ctx = JSON.parse(external_reference); } catch {}
        }

        try {
            if (payment_id && ctx?.u) {
                await Pago.create({
                    suscripcion_id: ctx.s,
                    usuario_id: ctx.u,
                    mp_payment_id: payment_id,
                    estado: 'pendiente',
                    monto_centavos: ctx.p,
                    moneda: ctx.m || 'CLP'
                });
            }

            const params = new URLSearchParams({
                status: 'pending',
                order_id: `ORD-${Date.now()}`,
                amount: (ctx ? (ctx.p / 100) : 0),
                payment_id: payment_id || 'N/A'
            });

            res.redirect(`${frontUrl}/payment/pending?${params.toString()}`);
        } catch (error) {
            console.error('Error en pago pendiente:', error);
            const params = new URLSearchParams({
                status: 'pending',
                order_id: `ORD-${Date.now()}`,
                reason: 'Pago en proceso de verificación'
            });
            res.redirect(`${frontUrl}/payment/pending?${params.toString()}`);
        }
    });

    return router;
};
