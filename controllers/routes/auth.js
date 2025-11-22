const express = require('express')
const userService = require('../../js/service/usuarios')

module.exports = function createAuthRouter() {
  const router = express.Router()

  router.post('/login', async (req, res) => {
    try {
      const { username, email, password } = req.body || {}
      const loginEmail = email || username
      if (!loginEmail || !password) return res.status(400).json({ message: 'Faltan credenciales', error_code: 'AUTH_MISSING' })
      const user = await userService.validateUser({ email: loginEmail, password })
      if (!user) return res.status(401).json({ message: 'Credenciales inválidas', error_code: 'AUTH_INVALID' })
      req.session.auth = { userId: user.id, role: user.rol }
      const apiUser = { id: user.id, username: user.email, email: user.email, nombreCompleto: user.nombre_completo, rol: user.rol }
      const redirectUrl = (user.rol === 'admin') ? '/admin' : '/'
      res.json({ message: 'Login exitoso', user: apiUser, redirectUrl })
    } catch (e) {
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
