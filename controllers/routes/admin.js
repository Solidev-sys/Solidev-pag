const express = require('express')

module.exports = function createAdminRouter({ ensureRole }) {
  const router = express.Router()

  router.get('/admin/ping', ensureRole('admin'), async (req, res) => {
    res.json({ message: 'ok', timestamp: new Date().toISOString() })
  })

  return router
}