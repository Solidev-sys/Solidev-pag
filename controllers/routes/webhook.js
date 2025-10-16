/**
 * Webhook de MercadoPago. Usa `WEBHOOK_ENABLED` para habilitar/deshabilitar.
 * Nota: Usa `express.raw({ type: 'application/json' })` en la ruta.
 */
const express = require('express');

module.exports = function createWebhookRouter() {
    const router = express.Router();

    router.post('/webhook-mercadopago', express.raw({ type: 'application/json' }), (req, res) => {
        const webhookEnabled = process.env.WEBHOOK_ENABLED !== 'false';
        const requiredToken = process.env.WEBHOOK_TOKEN;
        if (!webhookEnabled) {
            return res.status(200).json({ status: 'disabled', message: 'Webhook temporalmente desactivado' });
        }
        if (requiredToken && req.query.token !== requiredToken) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        console.log('Webhook recibido:', req.body);
        res.status(200).send('OK');
    });

    return router;
};