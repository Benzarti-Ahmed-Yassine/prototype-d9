const jwt = require('jsonwebtoken');
const { User } = require('../models/database');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'accès requis'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Vérifier si l'utilisateur existe toujours
        const user = await User.findByPk(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Token invalide ou utilisateur inactif'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Permissions insuffisantes'
            });
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    requireRole
};
