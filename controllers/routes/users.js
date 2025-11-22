const express = require('express')
const userService = require('../../js/service/usuarios')

module.exports = function createUsersRouter({ ensureRole }) {
  const router = express.Router()

  router.get('/users', ensureRole('admin'), async (req, res) => {
    try {
      const list = await userService.getUsers()
      res.json(list)
    } catch (e) {
      res.status(500).json({ error: 'Error al listar usuarios' })
    }
  })

  router.get('/users/:id', ensureRole('admin'), async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id)
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.json(user)
    } catch (e) {
      res.status(500).json({ error: 'Error al obtener usuario' })
    }
  })

  router.post('/users', async (req, res) => {
    try {
      const data = req.body || {}
      const email = data.email || data.username
      const password = data.password
      if (!email || !password) return res.status(400).json({ message: 'Faltan email y password', error_code: 'USR_MISSING_FIELDS' })
      const created = await userService.createUser({ email, password, nombre_completo: data.nombreCompleto || null, telefono: data.telefono || null, rol: 'cliente', estado: 'activo' })
      req.session.auth = { userId: created.id, role: created.rol }
      res.status(201).json({ message: 'Usuario creado', user: { id: created.id, username: created.email, email: created.email, nombreCompleto: created.nombre_completo, rol: created.rol }, redirectUrl: '/' })
    } catch (e) {
      const msg = e?.message || 'Error al crear usuario'
      let code = 'USR_CREATE_FAILED'
      if (/contraseña/i.test(msg)) code = 'USR_PASSWORD_WEAK'
      else if (/El email ya está registrado/i.test(msg)) code = 'USR_EMAIL_EXISTS'
      console.warn('Intento de registro fallido', { email: (req.body && (req.body.email || req.body.username)) || 'N/A', code })
      res.status(400).json({ message: msg, error_code: code })
    }
  })

  return router
}
