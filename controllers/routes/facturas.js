const express = require('express');
const facturaService = require('../../js/service/factura');

module.exports = function createFacturasRouter({ ensureAuth, ensureRole }) {
    const router = express.Router();

    // Admin: listar todas las facturas
    router.get('/facturas', ensureRole('admin'), async (req, res) => {
        try {
            const list = await facturaService.getInvoices();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar facturas' });
        }
    });

    // Admin: obtener factura por ID
    router.get('/facturas/:id', ensureRole('admin'), async (req, res) => {
        try {
            const factura = await facturaService.getInvoiceById(req.params.id);
            if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
            res.json(factura);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener factura' });
        }
    });

    // Admin: emitir factura (valida pago aprobado por hook)
    router.post('/facturas', ensureRole('admin'), async (req, res) => {
        try {
            const created = await facturaService.createInvoice(req.body);
            res.status(201).json(created);
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al emitir factura' });
        }
    });

    return router;
};