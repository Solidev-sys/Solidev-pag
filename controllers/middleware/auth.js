/**
 * Middlewares de autenticación y autorización basados en sesiones.
 */
function ensureAuth(req, res, next) {
    const auth = req.session && req.session.auth;
    if (auth && auth.userId) {
        req.userId = auth.userId;
        req.role = auth.role;
        return next();
    }
    if (process.env.SESSION_DEBUG === 'true') {
        console.debug('AUTH DEBUG: ensureAuth failed', {
            hasSession: !!req.session,
            hasAuth: !!(req.session && req.session.auth),
            cookie: req.headers['cookie'] || null,
            sameSite: process.env.SESSION_SAMESITE || 'lax',
            secure: (process.env.NODE_ENV || 'development') === 'production'
        });
    }
    return res.status(401).json({ message: 'No autenticado' });
}

function ensureRole(role) {
    return (req, res, next) => {
        const auth = req.session && req.session.auth;
        if (!auth || !auth.userId) return res.status(401).json({ message: 'No autenticado' });
        if (auth.role === role) return next();
        if (process.env.SESSION_DEBUG === 'true') {
            console.debug('AUTH DEBUG: ensureRole denied', { required: role, actual: auth.role });
        }
        return res.status(403).json({ message: 'Acceso denegado' });
    };
}

function ensureOwnerOrAdmin(paramName = 'id') {
    return (req, res, next) => {
        const auth = req.session && req.session.auth;
        if (!auth || !auth.userId) return res.status(401).json({ message: 'No autenticado' });
        if (auth.role === 'admin') return next();
        const target = parseInt(req.params[paramName], 10);
        if (!isNaN(target) && target === auth.userId) return next();
        if (process.env.SESSION_DEBUG === 'true') {
            console.debug('AUTH DEBUG: ensureOwnerOrAdmin denied', { param: paramName, target, userId: auth.userId, role: auth.role });
        }
        return res.status(403).json({ message: 'Acceso denegado' });
    };
}

module.exports = { ensureAuth, ensureRole, ensureOwnerOrAdmin };
