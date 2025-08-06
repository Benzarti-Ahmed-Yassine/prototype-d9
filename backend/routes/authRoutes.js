const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../services/authMiddleware');

const router = express.Router();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
