const express = require('express');
const notifService = require('../../js/service/notificacion');
const { Notificacion } = require('../../js/Models');

module.exports = function createNotificacionesRouter({ ensureAuth, ensureRole }) {
    const router = express.Router();

    // Admin: listar todas las notificaciones
    router.get('/notificaciones', ensureRole('admin'), async (req, res) => {
        try {
            const list = await notifService.getNotifications();
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar notificaciones' });
        }
    });

    // Auth: listar notificaciones del usuario autenticado
    router.get('/mis-notificaciones', ensureAuth, async (req, res) => {
        try {
            const list = await notifService.getNotificationsByUser(req.userId);
            res.json(list);
        } catch (err) {
            res.status(500).json({ error: 'Error al listar tus notificaciones' });
        }
    });

    // Admin: crear notificación
    router.post('/notificaciones', ensureRole('admin'), async (req, res) => {
        try {
            const created = await notifService.createNotification(req.body);
            res.status(201).json(created);
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al crear notificación' });
        }
    });

    // Auth: marcar como leída (propietario o admin)
    router.post('/mis-notificaciones/:id/marcar-leida', ensureAuth, async (req, res) => {
        try {
            const notif = await Notificacion.findByPk(req.params.id);
            if (!notif) return res.status(404).json({ error: 'Notificación no encontrada' });
            if (req.role !== 'admin' && notif.usuario_id !== req.userId) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
            const ok = await notifService.markAsRead(req.params.id);
            res.json({ read: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al marcar notificación' });
        }
    });

    // Admin: eliminar notificación
    router.delete('/notificaciones/:id', ensureRole('admin'), async (req, res) => {
        try {
            const ok = await notifService.deleteNotification(req.params.id);
            res.json({ deleted: ok });
        } catch (err) {
            res.status(400).json({ error: err.message || 'Error al eliminar notificación' });
        }
    });

    return router;
};