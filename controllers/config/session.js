/**
 * Configura sesiones:
 * - Usa Redis en producción si `REDIS_URL` y los paquetes están disponibles.
 * - En desarrollo, usa MemoryStore.
 * Variables: `SESSION_SECRET`, `SESSION_SAMESITE`, `NODE_ENV`, `REDIS_URL`.
 */
const session = require('express-session');

function setupSession(app) {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const SESSION_SECRET = process.env.SESSION_SECRET;

    if (!SESSION_SECRET) {
        console.warn('ADVERTENCIA: Falta SESSION_SECRET en variables de entorno. Define uno seguro en .env');
    }

    let RedisStore, createClient, sessionStore;
    try {
        RedisStore = require('connect-redis').default;
        ({ createClient } = require('redis'));
    } catch (e) {
        // En desarrollo puede no estar instalado Redis, se usará MemoryStore
    }

    if (NODE_ENV === 'production') {
        app.set('trust proxy', 1);
    }

    if (NODE_ENV === 'production' && RedisStore && process.env.REDIS_URL) {
        const redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', (err) => console.error('Redis error', err));
        redisClient.connect().catch(err => console.error('Redis connect error', err));
        sessionStore = new RedisStore({ client: redisClient, prefix: 'sess:' });
    }

    // Nota: si tu frontend está en otro dominio, usa sameSite='none' y secure=true
    let cookieSameSite = String(process.env.SESSION_SAMESITE || 'lax').toLowerCase();
    if (!['lax', 'strict', 'none'].includes(cookieSameSite)) cookieSameSite = 'lax';

    const secureOverrideRaw = process.env.SESSION_COOKIE_SECURE;
    let cookieSecure;
    if (typeof secureOverrideRaw === 'string' && secureOverrideRaw.trim().length > 0) {
        cookieSecure = secureOverrideRaw.trim().toLowerCase() === 'true';
    } else if (NODE_ENV === 'production') {
        cookieSecure = 'auto';
    } else {
        cookieSecure = false;
    }

    if (cookieSameSite === 'none' && cookieSecure === false) {
        cookieSameSite = 'lax';
    }

    app.use(session({
        name: 'sid',
        secret: SESSION_SECRET || 'dev-insecure-secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            secure: cookieSecure,
            sameSite: cookieSameSite,
            maxAge: 1000 * 60 * 60 * 2 // 2 horas
        }
    }));

    if (process.env.SESSION_DEBUG === 'true') {
        console.debug('AUTH DEBUG: session configured', {
            NODE_ENV,
            cookieSecure,
            cookieSameSite,
            store: sessionStore ? 'redis' : 'memory'
        });
    }
}

module.exports = { setupSession };
