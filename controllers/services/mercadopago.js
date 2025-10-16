/**
 * Inicializa el cliente de MercadoPago SDK 2.x.
 * Variables: `Access_token`.
 */
const { MercadoPagoConfig, Preference } = require('mercadopago');

function createMercadoPagoClient() {
    const client = new MercadoPagoConfig({
        accessToken: process.env.Access_token,
        options: {
            timeout: 5000,
            idempotencyKey: 'abc'
        }
    });
    return { client, Preference };
}

module.exports = { createMercadoPagoClient };