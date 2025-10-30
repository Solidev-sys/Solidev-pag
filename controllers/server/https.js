const http = require('http');
const https = require('https');
const fs = require('fs');

function startHttpsServer(app, port) {
    const https = require('https');
    const fs = require('fs');
    const path = require('path');

    function isReadableFile(p) {
        try {
            const st = fs.statSync(p);
            return st.isFile();
        } catch {
            return false;
        }
    }

    const PORT = port || 3002;
    const HOST = process.env.BIND || '0.0.0.0';

    const SSL_ENABLE   = (process.env.SSL_ENABLE || 'false').toLowerCase() === 'true';
    const SSL_KEY_PATH = process.env.SSL_KEY_PATH || 'key.pem';
    const SSL_CERT_PATH= process.env.SSL_CERT_PATH || 'cert.pem';

    const keyPath  = path.resolve(SSL_KEY_PATH);
    const certPath = path.resolve(SSL_CERT_PATH);

    if (SSL_ENABLE && isReadableFile(keyPath) && isReadableFile(certPath)) {
        const options = {
            key:  fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        };
        https.createServer(options, app).listen(PORT, HOST, () => {
            console.log(`🔒 HTTPS escuchando en https://${HOST}:${PORT}`);
        });
    } else {
        if (SSL_ENABLE) {
            try {
                const keyType  = fs.existsSync(keyPath)  ? (fs.statSync(keyPath).isDirectory() ? 'dir' : 'file/other') : 'missing';
                const certType = fs.existsSync(certPath) ? (fs.statSync(certPath).isDirectory() ? 'dir' : 'file/other') : 'missing';
                console.log(`[SSL] Cert/Key no utilizables (key=${keyPath}:${keyType}, cert=${certPath}:${certType}). Iniciando HTTP.`);
            } catch {
                console.log('[SSL] Error verificando cert/key. Iniciando HTTP.');
            }
        }
        const http = require('http');
        http.createServer(app).listen(PORT, HOST, () => {
            console.log(`🌐 HTTP escuchando en http://${HOST}:${PORT}`);
        });
    }
}

module.exports = { startHttpsServer };
