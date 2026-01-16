const { MercadoPagoConfig, Preference, PreApproval, PreApprovalPlan, Payment } = require('mercadopago');

function getMercadoPagoAccessToken() {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
        return process.env.MP_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN || process.env.Access_token;
    }
    return process.env.MP_ACCESS_TOKEN_TEST || process.env.MP_ACCESS_TOKEN || process.env.Access_token;
}

function createMercadoPagoClient() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    let accessToken;
    
    if (isProduction) {
        accessToken = getMercadoPagoAccessToken();
    } else {
        accessToken = getMercadoPagoAccessToken();
    }

    if (!accessToken) {
        console.warn('⚠️ ADVERTENCIA: No se ha configurado ningún Access Token de Mercado Pago.');
    }

    const client = new MercadoPagoConfig({
        accessToken,
        options: {
            timeout: 8000
        }
    });
    return { client, Preference, PreApproval, PreApprovalPlan, Payment };
}

module.exports = { createMercadoPagoClient, getMercadoPagoAccessToken };
