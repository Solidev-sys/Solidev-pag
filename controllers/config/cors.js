/**
 * Configura CORS usando `CORS_ORIGINS` y `NODE_ENV`.
 * - En desarrollo y sin `CORS_ORIGINS`, se permite cualquier origen (no recomendado en prod).
 * - En producción, solo se permiten orígenes definidos en `CORS_ORIGINS` (coma-separados).
 */
const cors = require('cors');

function setupCors(app) {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const allowedOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    const corsOptions = {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.length === 0 && NODE_ENV !== 'production') return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS: ' + origin));
        },
        credentials: true
    };

    app.use(cors(corsOptions));
}

module.exports = { setupCors };