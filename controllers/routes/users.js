const express = require('express')
const userService = require('../../js/service/usuarios')
const encryptionService = require('../../js/Utils/encryption')

module.exports = function createUsersRouter({ ensureAuth, ensureRole }) {
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

  router.put('/users/me/email', ensureAuth, async (req, res) => {
    try {
      const auth = req.session && req.session.auth
      const user = await userService.getUserById(auth.userId)
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado', error_code: 'USR_NOT_FOUND' })
      const { current_password, new_email } = req.body || {}
      if (!current_password || !new_email) return res.status(400).json({ message: 'Faltan datos', error_code: 'USR_UPDATE_MISSING' })
      const ok = await encryptionService.verifyPassword(current_password, (await require('../../js/Models').Usuario.findByPk(auth.userId)).hash_password)
      if (!ok) return res.status(401).json({ message: 'Credenciales actuales inválidas', error_code: 'USR_CREDENTIALS_INVALID' })
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(String(new_email))) return res.status(400).json({ message: 'Email inválido', error_code: 'USR_EMAIL_INVALID' })
      const exists = await require('../../js/Models').Usuario.findOne({ where: { email: new_email } })
      if (exists && exists.id !== auth.userId) return res.status(400).json({ message: 'El email ya está registrado', error_code: 'USR_EMAIL_EXISTS' })
      await userService.updateUser(auth.userId, { email: new_email })
      const updated = await userService.getUserById(auth.userId)
      res.json({ message: 'Email actualizado', user: updated })
    } catch (e) {
      res.status(400).json({ message: e?.message || 'Error al actualizar email', error_code: 'USR_EMAIL_UPDATE_FAILED' })
    }
  })

  router.put('/users/me/password', ensureAuth, async (req, res) => {
    try {
      const auth = req.session && req.session.auth
      const userModel = await require('../../js/Models').Usuario.findByPk(auth.userId)
      if (!userModel) return res.status(404).json({ message: 'Usuario no encontrado', error_code: 'USR_NOT_FOUND' })
      const { current_password, new_password } = req.body || {}
      if (!current_password || !new_password) return res.status(400).json({ message: 'Faltan datos', error_code: 'USR_UPDATE_MISSING' })
      const ok = await encryptionService.verifyPassword(current_password, userModel.hash_password)
      if (!ok) return res.status(401).json({ message: 'Credenciales actuales inválidas', error_code: 'USR_CREDENTIALS_INVALID' })
      const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      if (!complexity.test(String(new_password))) return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas y números', error_code: 'USR_PASSWORD_WEAK' })
      await userService.updateUser(auth.userId, { password: new_password })
      res.json({ message: 'Contraseña actualizada' })
    } catch (e) {
      res.status(400).json({ message: e?.message || 'Error al actualizar contraseña', error_code: 'USR_PASSWORD_UPDATE_FAILED' })
    }
  })

  router.put('/users/:id/email', ensureRole('admin'), async (req, res) => {
    try {
      const { new_email } = req.body || {}
      if (!new_email) return res.status(400).json({ message: 'Falta nuevo email', error_code: 'USR_UPDATE_MISSING' })
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(String(new_email))) return res.status(400).json({ message: 'Email inválido', error_code: 'USR_EMAIL_INVALID' })
      const exists = await require('../../js/Models').Usuario.findOne({ where: { email: new_email } })
      if (exists && String(exists.id) !== String(req.params.id)) return res.status(400).json({ message: 'El email ya está registrado', error_code: 'USR_EMAIL_EXISTS' })
      await userService.updateUser(req.params.id, { email: new_email })
      const updated = await userService.getUserById(req.params.id)
      res.json({ message: 'Email actualizado', user: updated })
    } catch (e) {
      res.status(400).json({ message: e?.message || 'Error al actualizar email', error_code: 'USR_EMAIL_UPDATE_FAILED' })
    }
  })

  router.put('/users/:id/password', ensureRole('admin'), async (req, res) => {
    try {
      const { new_password } = req.body || {}
      if (!new_password) return res.status(400).json({ message: 'Falta nueva contraseña', error_code: 'USR_UPDATE_MISSING' })
      const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      if (!complexity.test(String(new_password))) return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas y números', error_code: 'USR_PASSWORD_WEAK' })
      await userService.updateUser(req.params.id, { password: new_password })
      res.json({ message: 'Contraseña actualizada' })
    } catch (e) {
      res.status(400).json({ message: e?.message || 'Error al actualizar contraseña', error_code: 'USR_PASSWORD_UPDATE_FAILED' })
    }
  })

  return router
}
