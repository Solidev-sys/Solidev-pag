const express = require('express');

module.exports = function createTestRouter() {
    const router = express.Router();

    // GET /api/test
    router.get('/test', (req, res) => {
        res.json({ q: 'pex' });
    });

    return router;
};
