/**
 * Webhook de MercadoPago. Usa `WEBHOOK_ENABLED` para habilitar/deshabilitar.
 * Nota: Usa `express.raw({ type: 'application/json' })` en la ruta.
 */
const express = require('express');
const webhookService = require('../../js/service/webhook');
const pagoService = require('../../js/service/pago');
const facturaService = require('../../js/service/factura');
const { Suscripcion } = require('../../js/Models');

module.exports = function createWebhookRouter({ payment }) {
    const router = express.Router();

    router.post('/webhook-mercadopago', express.raw({ type: 'application/json' }), async (req, res) => {
        const webhookEnabled = process.env.WEBHOOK_ENABLED !== 'false';
        const requiredToken = process.env.WEBHOOK_TOKEN;
        if (!webhookEnabled) {
            return res.status(200).json({ status: 'disabled', message: 'Webhook temporalmente desactivado' });
        }
        if (requiredToken && req.query.token !== requiredToken) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        let payload;
        try {
            payload = JSON.parse(req.body.toString('utf8'));
        } catch (e) {
            return res.status(400).json({ error: 'Payload inválido' });
        }

        const topico = payload.type || payload.action || payload.topic || 'desconocido';
        const externoId = payload?.data?.id ? String(payload.data.id) : null;
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
                const [usuario_id, suscripcion_id] = extRef.includes(':') ? extRef.split(':').map(v => Number(v)) : [null, null];

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
            res.status(200).send('OK');
        } catch (err) {
            if (whRow?.id) await webhookService.markWebhookProcessed(whRow.id, err.message);
            res.status(500).json({ error: 'Error procesando webhook' });
        }
    });

    return router;
};