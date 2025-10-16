const express = require('express');
const pagesService = require('../../js/service/paginaSitio');

module.exports = function createPaginasRouter({ ensureAuth, ensureRole }) {
    const router = express.Router();

    // Público: listar páginas del sitio
    router.get('/paginas', async (req, res) => {
        try {
            const list = await pagesService.getPages();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar páginas' });
        }
    });

    // Público: obtener una página por slug
    router.get('/paginas/:slug', async (req, res) => {
        try {
            const page = await pagesService.getPageBySlug(req.params.slug);
            if (!page) return res.status(404).json({ error: 'Página no encontrada' });
            res.json(page);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener página' });
        }
    });

    // Admin: crear página
    router.post('/paginas', ensureRole('admin'), async (req, res) => {
        try {
            const created = await pagesService.createPage(req.body);
            res.status(201).json(created);
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al crear página' });
        }
    });

    // Admin: actualizar página
    router.put('/paginas/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await pagesService.updatePage(req.params.id, req.body);
            res.json({ updated: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al actualizar página' });
        }
    });

    // Admin: eliminar página
    router.delete('/paginas/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await pagesService.deletePage(req.params.id);
            res.json({ deleted: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al eliminar página' });
        }
    });

    return router;
};