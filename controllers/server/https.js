/**
 * Inicializa servidor HTTPS si existen `key.pem` y `cert.pem`.
 * Mantiene el mismo comportamiento/logs que el archivo original.
 */
const https = require('https');
const fs = require('fs');

function startHttpsServer(app, port) {
    try {
        if (fs.existsSync('key.pem') && fs.existsSync('cert.pem')) {
            const options = {
                key: fs.readFileSync('key.pem'),
                cert: fs.readFileSync('cert.pem')
            };

            https.createServer(options, app).listen(port, () => {
                console.log(`🔒 Servidor HTTPS ejecutándose en https://localhost:${port}`);
            });
        } else {
            console.log(`⚠️  Certificados SSL no encontrados. Solo HTTP disponible.`);
        }
    } catch (error) {
        console.log(`⚠️  Error al iniciar HTTPS: ${error.message}`);
        const httpPort = process.env.HTTP_PORT || 3002;
        console.log(`📋 Solo HTTP disponible: http://localhost:${httpPort}`);
    }
}

module.exports = { startHttpsServer };