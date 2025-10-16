const express = require('express');
const pagoService = require('../../js/service/pago');

module.exports = function createPagosRouter({ ensureAuth, ensureRole }) {
    const router = express.Router();

    // Admin: listar todos los pagos
    router.get('/pagos', ensureRole('admin'), async (req, res) => {
        try {
            const list = await pagoService.getPayments();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar pagos' });
        }
    });

    // Auth: obtener un pago (propietario o admin)
    router.get('/pagos/:id', ensureAuth, async (req, res) => {
        try {
            const pago = await pagoService.getPaymentById(req.params.id);
            if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
            if (req.role !== 'admin' && pago.usuario_id !== req.userId) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            res.json(pago);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener pago' });
        }
    });

    // Admin: crear pago manual (backoffice)
    router.post('/pagos', ensureRole('admin'), async (req, res) => {
        try {
            const created = await pagoService.createPayment(req.body);
            res.status(201).json(created);
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al crear pago' });
        }
    });

    // Admin: actualizar pago
    router.put('/pagos/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await pagoService.updatePayment(req.params.id, req.body);
            res.json({ updated: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al actualizar pago' });
        }
    });

    return router;
};