const express = require('express');
const { register, login, getProfile, logout } = require('../controllers/authController');
const { authenticateToken } = require('../services/authMiddleware');

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);

// Route de test
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes are working',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
