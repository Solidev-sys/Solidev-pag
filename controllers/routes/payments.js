// Módulo: createPaymentsRouter
const express = require('express');
const { Usuario, Suscripcion, Plan, Pago } = require('../../js/Models');

module.exports = function createPaymentsRouter({
    ensureAuth,
    preference,
    ngrok
}) {
    const router = express.Router();
    const frontUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    // POST /api/pago: crea preferencia para una suscripción específica
    router.post('/pago', ensureAuth, async (req, res) => {
        try {
            const usuario_id = req.userId;
            const { suscripcion_id, items: clientItems, total } = req.body || {};
            const accessToken = process.env.MP_ACCESS_TOKEN || process.env.Access_token;
            if (!accessToken) return res.status(500).json({ message: 'Token de Mercado Pago no configurado', error_code: 'PAY_MP_TOKEN_MISSING' });
            const usuario = await Usuario.findByPk(usuario_id);
            if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado', error_code: 'PAY_USER_NOT_FOUND' });
            if (!usuario.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) return res.status(400).json({ message: 'Email del comprador inválido', error_code: 'PAY_EMAIL_INVALID' });

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
                email: usuario.email,
                phone: { area_code: '57', number: usuario.telefono || '0000000' },
                identification: { type: 'CC', number: 'N/A' },
                address: { street_name: 'N/A', street_number: 0, zip_code: '000000' }
            };

            const baseUrl = (ngrok && typeof ngrok === 'string' && ngrok.length > 0)
                ? ngrok
                : `http://localhost:${process.env.HTTP_PORT || 3002}`;
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
                external_reference: suscripcion_id ? `${usuario_id}:${suscripcion_id}` : `${usuario_id}:carrito`,
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

            console.log('PAYMENT preference.create body', {
                usuario_id,
                suscripcion_id: suscripcion_id || null,
                items,
                back_urls: preferenceData.back_urls,
                notification_url: preferenceData.notification_url || null
            });
            const response = await preference.create({ body: preferenceData });
            console.log('PAYMENT preference.create response', { init_point: response?.init_point, id: response?.id || response?.preference_id });

            // Guarda contexto mínimo en la sesión para las rutas de retorno
            req.session.mercadoPagoCtx = {
                suscripcion_id: suscripcion_id || null,
                precio_centavos: priceCentavos,
                moneda: currency,
                plan_nombre: planNombre
            };

            res.json({ init_point: response.init_point });
        } catch (error) {
            const msg = error?.message || 'Error al procesar el pago';
            const code = error?.code || 'PAY_PREFERENCE_FAILED';
            console.error('PAYMENT preference error', { message: msg, code, error });
            res.status(error?.status || 500).json({ message: msg, error_code: code });
        }
    });

    // GET /api/pago-exitoso: registra pago aprobado y redirige
    router.get('/pago-exitoso', async (req, res) => {
        const { payment_id } = req.query;
        const usuario_id = req.userId;

        if (!payment_id) {
            return res.redirect('/payment/failed?reason=ID%20de%20pago%20no%20encontrado');
        }

        try {
            const existing = await Pago.findOne({ where: { mp_payment_id: payment_id } });
            if (existing) {
                const params = new URLSearchParams({
                    order_id: payment_id,
                    user_id: usuario_id,
                    subtotal: (existing.monto_centavos / 100).toFixed(2),
                    items: JSON.stringify([{ nombre: 'Pago registrado previamente', cantidad: 1, precio: (existing.monto_centavos / 100).toFixed(2) }])
                });
                return res.redirect(`/payments/payment-success.html?${params.toString()}`);
            }

            const ctx = req.session.mercadoPagoCtx;
            if (!ctx) {
                return res.redirect('/payment/failed?reason=Contexto%20de%20pago%20no%20encontrado');
            }

            const nuevoPago = await Pago.create({
                suscripcion_id: ctx.suscripcion_id,
                usuario_id,
                mp_payment_id: payment_id,
                estado: 'aprobado',
                monto_centavos: ctx.precio_centavos,
                moneda: ctx.moneda || 'CLP',
                pagado_en: new Date()
            });

            const params = new URLSearchParams({
                order_id: payment_id,
                user_id: usuario_id,
                payment_id: payment_id,
                subtotal: (ctx.precio_centavos / 100).toFixed(2),
                item_name: ctx.plan_nombre
            });

            res.redirect(`${frontUrl}/payment/success?${params.toString()}`);
        } catch (error) {
            console.error("Error en pago-exitoso:", error);
            res.redirect('/payment/failed?reason=Error%20interno%20del%20servidor');
        }
    });

    // GET /api/pago-fallido: registra intento fallido y redirige
    router.get('/pago-fallido', async (req, res) => {
        const payment_id = req.query.payment_id;

        console.log('Pago fallido recibido:', { userId: req.userId, payment_id });

        try {
            const ctx = req.session.mercadoPagoCtx;
            if (payment_id && ctx) {
                await Pago.create({
                    suscripcion_id: ctx.suscripcion_id,
                    usuario_id: req.userId,
                    mp_payment_id: payment_id,
                    estado: 'rechazado',
                    monto_centavos: ctx.precio_centavos,
                    moneda: ctx.moneda || 'CLP',
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

        console.log('Pago pendiente:', { userId: req.userId, payment_id });

        try {
            const ctx = req.session.mercadoPagoCtx;
            if (payment_id && ctx) {
                await Pago.create({
                    suscripcion_id: ctx.suscripcion_id,
                    usuario_id: req.userId,
                    mp_payment_id: payment_id,
                    estado: 'pendiente',
                    monto_centavos: ctx.precio_centavos,
                    moneda: ctx.moneda || 'CLP'
                });
            }

            const params = new URLSearchParams({
                status: 'pending',
                order_id: `ORD-${Date.now()}`,
                amount: (ctx ? (ctx.precio_centavos / 100) : 0),
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
