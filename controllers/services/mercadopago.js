const { MercadoPagoConfig, Preference, PreApproval, PreApprovalPlan, Payment } = require('mercadopago');

function createMercadoPagoClient() {
    const accessToken = process.env.MP_ACCESS_TOKEN || process.env.Access_token;
    const client = new MercadoPagoConfig({
        accessToken,
        options: {
            timeout: 8000
        }
    });
    return { client, Preference, PreApproval, PreApprovalPlan, Payment };
}

module.exports = { createMercadoPagoClient };