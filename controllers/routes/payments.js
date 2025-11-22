// Módulo: createPaymentsRouter
const express = require('express');
const { Usuario, Suscripcion, Plan, Pago } = require('../../js/Models');

module.exports = function createPaymentsRouter({
    ensureAuth,
    preference,
    ngrok
}) {
    const router = express.Router();

    // POST /api/pago: crea preferencia para una suscripción específica
    router.post('/pago', ensureAuth, async (req, res) => {
        try {
            const usuario_id = req.userId;
            const { suscripcion_id } = req.body;
            if (!suscripcion_id) return res.status(400).json({ message: 'Falta suscripcion_id', error_code: 'PAY_MISSING_SUBS' });
            const accessToken = process.env.MP_ACCESS_TOKEN || process.env.Access_token;
            if (!accessToken) return res.status(500).json({ message: 'Token de Mercado Pago no configurado', error_code: 'PAY_MP_TOKEN_MISSING' });

            const suscripcion = await Suscripcion.findByPk(suscripcion_id, {
                include: [{ model: Plan }, { model: Usuario }]
            });
            if (!suscripcion || suscripcion.usuario_id !== usuario_id) return res.status(404).json({ message: 'Suscripción no encontrada o no pertenece al usuario', error_code: 'PAY_SUBS_NOT_FOUND' });

            const plan = await Plan.findByPk(suscripcion.plan_id);
            const usuario = await Usuario.findByPk(usuario_id);
            if (!plan || !usuario) return res.status(404).json({ message: 'Datos de plan/usuario no disponibles', error_code: 'PAY_DATA_MISSING' });
            if (!plan.activo) return res.status(400).json({ message: 'El plan no está activo', error_code: 'PAY_PLAN_INACTIVE' });
            if (!usuario.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) return res.status(400).json({ message: 'Email del comprador inválido', error_code: 'PAY_EMAIL_INVALID' });
            if (!plan.moneda || plan.moneda.length !== 3) return res.status(400).json({ message: 'Moneda inválida', error_code: 'PAY_CURRENCY_INVALID' });
            const allowedCurrencies = new Set(['CLP','ARS','BRL','COP','MXN','USD']);
            if (!allowedCurrencies.has((plan.moneda || '').toUpperCase())) return res.status(400).json({ message: 'Moneda no soportada por Mercado Pago', error_code: 'PAY_CURRENCY_UNSUPPORTED' });
            if (!plan.precio_centavos || plan.precio_centavos <= 0) return res.status(400).json({ message: 'Monto inválido', error_code: 'PAY_AMOUNT_INVALID' });

            const items = [{
                id: suscripcion_id.toString(),
                title: plan.nombre || `Suscripción ${plan.codigo}`,
                description: `Pago de suscripción (${plan.ciclo_fact})`,
                quantity: 1,
                unit_price: plan.precio_centavos / 100,
                currency_id: plan.moneda || 'CLP'
            }];

            const payer = {
                name: usuario.nombre_completo || '',
                surname: '',
                email: usuario.email,
                phone: {
                    area_code: '57',
                    number: usuario.telefono || '0000000'
                },
                identification: {
                    type: 'CC',
                    number: 'N/A'
                },
                address: {
                    street_name: 'N/A',
                    street_number: 0,
                    zip_code: '000000'
                }
            };

            const preferenceData = {
                items,
                payer,
                back_urls: {
                    success: ngrok + "/api/pago-exitoso",
                    failure: ngrok + "/api/pago-fallido",
                    pending: ngrok + "/api/pago-pendiente"
                },
                auto_return: "approved",
                external_reference: `${usuario_id}:${suscripcion_id}`,
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 12
                },
                shipments: {
                    mode: "not_specified"
                },
                notification_url: ngrok + "/api/webhook-mercadopago"
            };

            const response = await preference.create({ body: preferenceData });

            // Guarda contexto mínimo en la sesión para las rutas de retorno
            req.session.mercadoPagoCtx = {
                suscripcion_id,
                precio_centavos: plan.precio_centavos,
                moneda: plan.moneda,
                plan_nombre: plan.nombre
            };

            res.json({ init_point: response.init_point });
        } catch (error) {
            const msg = error?.message || 'Error al procesar el pago';
            const code = error?.code || 'PAY_PREFERENCE_FAILED';
            res.status(error?.status || 500).json({ message: msg, error_code: code });
        }
    });

    // GET /api/pago-exitoso: registra pago aprobado y redirige
    router.get('/pago-exitoso', ensureAuth, async (req, res) => {
        const { payment_id } = req.query;
        const usuario_id = req.userId;

        if (!payment_id) {
            return res.redirect('/payments/payment-failed.html?reason=ID de pago no encontrado');
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
                return res.redirect('/payments/payment-failed.html?reason=Contexto de pago no encontrado');
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
                items: JSON.stringify([{ nombre: ctx.plan_nombre, cantidad: 1, precio: (ctx.precio_centavos / 100).toFixed(2) }])
            });

            res.redirect(`/payments/payment-succes.html?${params.toString()}`);
        } catch (error) {
            console.error("Error en pago-exitoso:", error);
            res.redirect('/payments/payment-failed.html?reason=Error interno del servidor');
        }
    });

    // GET /api/pago-fallido: registra intento fallido y redirige
    router.get('/pago-fallido', ensureAuth, async (req, res) => {
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

        res.redirect(`/payments/payment-failed.html?${params.toString()}`);
    });

    // GET /api/pago-pendiente: registra intento pendiente y redirige
    router.get('/pago-pendiente', ensureAuth, async (req, res) => {
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

            res.redirect(`/payments/payments-pending.html?${params.toString()}`);
        } catch (error) {
            console.error('Error en pago pendiente:', error);
            const params = new URLSearchParams({
                status: 'pending',
                order_id: `ORD-${Date.now()}`,
                reason: 'Pago en proceso de verificación'
            });
            res.redirect(`/payments.html?${params.toString()}`);
        }
    });

    return router;
};
