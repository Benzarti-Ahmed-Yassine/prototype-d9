const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const { authMiddleware, requireRole } = require('../services/authMiddleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes pour les prescriptions
router.get('/', prescriptionController.getAll);
router.get('/:id', prescriptionController.getById);
router.post('/', requireRole(['doctor', 'admin']), prescriptionController.create);
router.put('/:id', requireRole(['doctor', 'admin']), prescriptionController.update);
router.delete('/:id', requireRole(['doctor', 'admin']), prescriptionController.delete);

module.exports = router;
