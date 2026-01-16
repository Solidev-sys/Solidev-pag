const express = require('express')
const webhookService = require('../../js/service/webhook')

module.exports = function createAdminRouter({ ensureRole }) {
  const router = express.Router()

  router.get('/admin/ping', ensureRole('admin'), async (req, res) => {
    res.json({ message: 'ok', timestamp: new Date().toISOString() })
  })

  router.get('/admin/webhooks', ensureRole('admin'), async (req, res) => {
    try {
      const list = await webhookService.getWebhooks()
      res.json(list)
    } catch (e) {
      res.status(500).json({ error: 'Error al listar webhooks' })
    }
  })

  return router
}
