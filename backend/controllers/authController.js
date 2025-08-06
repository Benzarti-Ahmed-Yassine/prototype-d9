const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/database');
const hederaService = require('../hedera/hederaService');

class AuthController {
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, role = 'patient' } = req.body;

            // Validation
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({
                    success: false,
                    message: 'Tous les champs sont requis'
                });
            }

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Un utilisateur avec cet email existe déjà'
                });
            }

            // Hasher le mot de passe
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Créer l'utilisateur
            const user = await User.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role,
                isActive: true
            });

            // Log audit
            await hederaService.submitAuditLog('USER_REGISTERED', {
                userId: user.id,
                email: user.email,
                role: user.role
            });

            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email et mot de passe requis'
                });
            }

            // Trouver l'utilisateur
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants invalides'
                });
            }

            // Vérifier le mot de passe
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants invalides'
                });
            }

            // Vérifier si le compte est actif
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Mettre à jour la dernière connexion
            await user.update({ lastLogin: new Date() });

            // Log audit
            await hederaService.logUserLogin(user);

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            res.json({
                success: true,
                user
            });
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async logout(req, res) {
        try {
            // Log audit
            await hederaService.submitAuditLog('USER_LOGOUT', {
                userId: req.user.userId,
                email: req.user.email
            });

            res.json({
                success: true,
                message: 'Déconnexion réussie'
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
}

module.exports = new AuthController();
