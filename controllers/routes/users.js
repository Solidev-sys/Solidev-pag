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
      if (!email || !password) return res.status(400).json({ message: 'Faltan email y password' })
      const created = await userService.createUser({ email, password, nombre_completo: data.nombreCompleto || null, telefono: data.telefono || null, rol: 'cliente', estado: 'activo' })
      res.status(201).json({ message: 'Usuario creado', user: { id: created.id, username: created.email, email: created.email, nombreCompleto: created.nombre_completo, rol: created.rol } })
    } catch (e) {
      res.status(400).json({ message: e.message || 'Error al crear usuario' })
    }
  })

  return router
}