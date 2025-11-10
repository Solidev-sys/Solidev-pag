function startServer(app, port) {
    const PORT = port || 3002;
    const HOST = process.env.BIND || '0.0.0.0';
    const http = require('http');
    http.createServer(app).listen(PORT, HOST, () => {
        console.log(`🌐 HTTP escuchando en http://${HOST}:${PORT}`);
    });
    }

module.exports = { startServer };
