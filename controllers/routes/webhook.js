/**
 * Webhook de MercadoPago. Usa `WEBHOOK_ENABLED` para habilitar/deshabilitar.
 * Nota: Usa `express.raw({ type: 'application/json' })` en la ruta.
 */
const express = require('express');
const { verifyMpWebhookSignature } = require('../utils/mercadopagoSecurity');
const webhookService = require('../../js/service/webhook');
const pagoService = require('../../js/service/pago');
const facturaService = require('../../js/service/factura');
const { Suscripcion } = require('../../js/Models');

module.exports = function createWebhookRouter({ payment }) {
    const router = express.Router();

    router.post('/webhook-mercadopago', express.raw({ type: 'application/json' }), async (req, res) => {
        const ts = new Date().toISOString();
        const webhookEnabled = process.env.WEBHOOK_ENABLED !== 'false';
        const requiredToken = process.env.WEBHOOK_TOKEN;
        const mpWebhookSecret = String(process.env.MP_WEBHOOK_SECRET || '').trim();
        if (!webhookEnabled) {
            console.log(`[${ts}] WEBHOOK disabled`);
            return res.status(200).json({ status: 'disabled', message: 'Webhook temporalmente desactivado' });
        }
        if (requiredToken && req.query.token !== requiredToken) {
            console.warn(`[${ts}] WEBHOOK token inválido desde ${req.ip}`);
            return res.status(401).json({ error: 'Token inválido' });
        }

        let payload;
        try {
            const raw = req.body;
            if (Buffer.isBuffer(raw)) payload = JSON.parse(raw.toString('utf8'));
            else if (typeof raw === 'string') payload = JSON.parse(raw);
            else if (raw && typeof raw === 'object') payload = raw;
            else throw new Error('invalid');
        } catch (e) {
            console.warn(`[${ts}] WEBHOOK payload inválido`);
            return res.status(400).json({ error: 'Payload inválido' });
        }

        const topico = payload.type || payload.action || payload.topic || 'desconocido';
        const externoId = payload?.data?.id ? String(payload.data.id) : null;
        const requestId = String(req.get('x-request-id') || '').trim() || null;
        const signatureHeader = req.get('x-signature');
        const verification = verifyMpWebhookSignature({
            secret: mpWebhookSecret,
            signatureHeader,
            requestId,
            dataId: externoId || String(req.query['data.id'] || '').trim() || null
        });
        if (!verification.ok) {
            console.warn(`[${ts}] WEBHOOK firma inválida`, { topico, externoId, requestId });
            return res.status(401).json({ error: 'Firma inválida' });
        }
        console.log(`[${ts}] WEBHOOK recibido`, { topico, externoId });
        let whRow;
        try {
            whRow = await webhookService.createWebhook({
                proveedor: 'mercadopago',
                topico,
                id_externo: externoId,
                id_evento: payload.id || payload.event_id || null,
                payload,
                usuario_id: null
            });
        } catch (e) {
            // continúa pero registra error luego
        }

        try {
            if (topico.includes('payment') && externoId) {
                const info = await payment.get({ id: Number(externoId) });
                const status = (info.status || '').toLowerCase();
                const estado = status === 'approved' ? 'aprobado' : status === 'authorized' ? 'autorizado' : status === 'pending' ? 'pendiente' : status === 'rejected' ? 'rechazado' : 'en_proceso';
                const moneda = info.currency_id || 'CLP';
                const amountCent = Math.round((info.transaction_amount || 0) * 100);
                const extRef = info.external_reference || '';
                let usuario_id = null;
                let suscripcion_id = null;
                if (extRef) {
                    if (String(extRef).includes(':')) {
                        const [u, s] = String(extRef).split(':');
                        usuario_id = Number(u);
                        suscripcion_id = Number(s);
                    } else {
                        try {
                            const parsed = JSON.parse(String(extRef));
                            usuario_id = Number(parsed?.u);
                            suscripcion_id = parsed?.s != null ? Number(parsed.s) : null;
                        } catch {}
                    }
                }

                if (!suscripcion_id || !usuario_id) {
                    const preId = info.preapproval_id;
                    if (preId) {
                        const sub = await Suscripcion.findOne({ where: { mp_preapproval_id: preId } });
                        if (sub) {
                            suscripcion_id = sub.id;
                            usuario_id = sub.usuario_id;
                        }
                    }
                }

                if (suscripcion_id && usuario_id) {
                    const sub = await Suscripcion.findByPk(suscripcion_id);
                    if (sub) {
                        const plan = await require('../../js/Models').Plan.findByPk(sub.plan_id);
                        if (plan) {
                            const expectedAmount = plan.precio_centavos;
                            const expectedCurrency = (plan.moneda || 'CLP').toUpperCase();
                            if (expectedAmount && amountCent && expectedAmount !== amountCent) {
                                if (whRow?.id) await webhookService.markWebhookProcessed(whRow.id, 'Monto no coincide');
                                return res.status(400).json({ error: 'Monto no coincide', error_code: 'IPN_MISMATCH_AMOUNT' });
                            }
                            if (expectedCurrency !== moneda.toUpperCase()) {
                                if (whRow?.id) await webhookService.markWebhookProcessed(whRow.id, 'Moneda no coincide');
                                return res.status(400).json({ error: 'Moneda no coincide', error_code: 'IPN_MISMATCH_CURRENCY' });
                            }
                        }
                    }
                }

                const created = await pagoService.createPayment({
                    suscripcion_id,
                    usuario_id,
                    mp_payment_id: String(info.id),
                    estado,
                    monto_centavos: amountCent,
                    moneda,
                    pagado_en: estado === 'aprobado' ? new Date() : null,
                    payload_crudo: info
                });

                if (estado === 'aprobado') {
                    try {
                        const numero = `F-${Date.now()}-${info.id}`;
                        await facturaService.createInvoice({
                            pago_id: created.id,
                            numero,
                            ruta_pdf: `/invoices/${numero}.pdf`,
                            emitida_en: new Date(),
                            impuesto_cent: 0,
                            neto_cent: created.monto_centavos,
                            total_cent: created.monto_centavos
                        });
                    } catch (e) {}
                }
            }

            if (whRow?.id) await webhookService.markWebhookProcessed(whRow.id, null);
            console.log(`[${ts}] WEBHOOK procesado OK`);
            res.status(200).send('OK');
        } catch (err) {
            if (whRow?.id) await webhookService.markWebhookProcessed(whRow.id, err.message);
            console.error(`[${ts}] WEBHOOK error`, { error: err?.message });
            res.status(500).json({ error: 'Error procesando webhook' });
        }
    });

    return router;
};
