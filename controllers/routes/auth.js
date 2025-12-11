const express = require('express')
const userService = require('../../js/service/usuarios')

module.exports = function createAuthRouter() {
  const router = express.Router()

  router.post('/login', async (req, res) => {
    try {
      const { username, email, password } = req.body || {}
      const loginEmailRaw = email || username
      const loginEmail = typeof loginEmailRaw === 'string' ? loginEmailRaw.trim().toLowerCase() : ''
      const pwd = typeof password === 'string' ? password : ''
      if (!loginEmail || !pwd) return res.status(400).json({ message: 'Faltan credenciales', error_code: 'AUTH_MISSING' })
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(loginEmail)) return res.status(400).json({ message: 'Email inválido', error_code: 'AUTH_EMAIL_INVALID' })
      const user = await userService.validateUser({ email: loginEmail, password: pwd })
      if (!user) return res.status(401).json({ message: 'Credenciales inválidas', error_code: 'AUTH_INVALID' })
      if (String(user.estado).toLowerCase() !== 'activo') return res.status(403).json({ message: 'Usuario bloqueado o pendiente', error_code: 'AUTH_USER_INACTIVE' })
      req.session.regenerate(err => {
        if (err) {
          console.debug('AUTH DEBUG: session regenerate failed', { ip: req.ip, ua: req.headers['user-agent'] || null, error: err?.message })
          return res.status(500).json({ message: 'Error guardando sesión', error_code: 'AUTH_SESSION_REGEN_FAILED' })
        }
        req.session.auth = { userId: user.id, role: user.rol }
        req.session.save(saveErr => {
          if (saveErr) {
            console.debug('AUTH DEBUG: session save failed', { userId: user.id, ip: req.ip, ua: req.headers['user-agent'] || null, error: saveErr?.message })
            return res.status(500).json({ message: 'Error guardando sesión', error_code: 'AUTH_SESSION_SAVE_FAILED' })
          }
          if (process.env.SESSION_DEBUG === 'true') {
            console.debug('AUTH DEBUG: login success', { userId: user.id, role: user.rol, ip: req.ip })
          }
          const apiUser = { id: user.id, username: user.email, email: user.email, nombreCompleto: user.nombre_completo, rol: user.rol }
          const redirectUrl = (user.rol === 'admin') ? '/admin' : '/'
          res.json({ message: 'Sesión guardada', sessionSaved: true, user: apiUser, redirectUrl })
        })
      })
    } catch (e) {
      console.debug('AUTH DEBUG: login handler error', { ip: req.ip, ua: req.headers['user-agent'] || null, error: e?.message })
      res.status(500).json({ message: 'Error de servidor', error_code: 'AUTH_SERVER' })
    }
  })

  router.post('/logout', async (req, res) => {
    try {
      req.session.destroy(() => {})
      res.json({ message: 'Logout exitoso' })
    } catch (e) {
      res.json({ message: 'Logout ejecutado' })
    }
  })

  router.get('/users/me', async (req, res) => {
    try {
      const auth = req.session && req.session.auth
      if (!auth || !auth.userId) return res.status(401).json({ message: 'No autenticado' })
      const user = await userService.getUserById(auth.userId)
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
      const apiUser = { id: user.id, username: user.email, email: user.email, nombreCompleto: user.nombre_completo, rol: user.rol }
      res.json(apiUser)
    } catch (e) {
      res.status(500).json({ message: 'Error de servidor' })
    }
  })

  return router
}
