const http = require('http');
const https = require('https');
const fs = require('fs');

function startHttpsServer(app, port) {
  const PORT = port || 3002;
  const HOST = process.env.BIND || '0.0.0.0';

  const SSL_ENABLE   = (process.env.SSL_ENABLE || 'false').toLowerCase() === 'true';
  const SSL_KEY_PATH = process.env.SSL_KEY_PATH || 'key.pem';
  const SSL_CERT_PATH= process.env.SSL_CERT_PATH || 'cert.pem';

  if (SSL_ENABLE && fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
    const options = {
      key:  fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    };
    https.createServer(options, app).listen(PORT, HOST, () => {
      console.log(`🔒 HTTPS escuchando en https://${HOST}:${PORT}`);
    });
  } else {
    if (SSL_ENABLE) {
      console.log('⚠️  SSL_ENABLE=TRUE pero no se encontraron certificados; iniciando HTTP.');
    }
    http.createServer(app).listen(PORT, HOST, () => {
      console.log(`🌐 HTTP escuchando en http://${HOST}:${PORT}`);
    });
  }
}

module.exports = { startHttpsServer };
