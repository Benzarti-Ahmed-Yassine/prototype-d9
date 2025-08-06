const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const hederaService = require('../hedera/hederaService');

// Comptes de démonstration
const demoAccounts = [
    {
        email: 'doctor@hospital.com',
        password: 'demo123',
        role: 'doctor',
        name: 'Dr. Jean Dupont',
        department: 'Cardiologie'
    },
    {
        email: 'pharmacist@pharmacy.com',
        password: 'demo123',
        role: 'pharmacist',
        name: 'Marie Martin',
        pharmacy: 'Pharmacie Centrale'
    },
    {
        email: 'driver@delivery.com',
        password: 'demo123',
        role: 'driver',
        name: 'Pierre Durand',
        vehicle: 'VAN-001'
    },
    {
        email: 'patient@email.com',
        password: 'demo123',
        role: 'patient',
        name: 'Sophie Moreau',
        patientId: 'P-12345'
    },
    {
        email: 'admin@mediflow.com',
        password: 'demo123',
        role: 'admin',
        name: 'Admin MediFlow',
        permissions: 'all'
    }
];

const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET || 'mediflow-secret-key',
        { expiresIn: '24h' }
    );
};

const register = async (req, res) => {
    try {
        const { email, password, role, name, ...additionalData } = req.body;

        // Validation
        if (!email || !password || !role || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, mot de passe, rôle et nom sont requis'
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

        // Hacher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer un compte Hedera
        const hederaAccount = await hederaService.createAccount();

        // Créer l'utilisateur
        const user = await User.create({
            email,
            password: hashedPassword,
            role,
            name,
            hederaAccountId: hederaAccount.accountId,
            hederaPrivateKey: hederaAccount.privateKey,
            hederaPublicKey: hederaAccount.publicKey,
            additionalData: JSON.stringify(additionalData),
            isActive: true
        });

        // Audit log
        await hederaService.submitAuditLog('USER_REGISTERED', user.id, {
            email,
            role,
            name,
            hederaAccountId: hederaAccount.accountId
        });

        // Générer le token
        const token = generateToken(user.id, user.email, user.role);

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    hederaAccountId: user.hederaAccountId
                }
            }
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        // Vérifier d'abord les comptes de démo
        const demoAccount = demoAccounts.find(account => account.email === email);
        if (demoAccount && password === demoAccount.password) {
            const token = generateToken('demo-' + demoAccount.role, demoAccount.email, demoAccount.role);
            
            // Audit log pour les comptes de démo
            await hederaService.submitAuditLog('DEMO_LOGIN', 'demo-' + demoAccount.role, {
                email: demoAccount.email,
                role: demoAccount.role
            });

            return res.json({
                success: true,
                message: 'Connexion réussie (compte de démo)',
                data: {
                    token,
                    user: {
                        id: 'demo-' + demoAccount.role,
                        email: demoAccount.email,
                        role: demoAccount.role,
                        name: demoAccount.name,
                        isDemo: true,
                        ...demoAccount
                    }
                }
            });
        }

        // Vérifier dans la base de données
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier si le compte est actif
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Compte désactivé'
            });
        }

        // Audit log
        await hederaService.submitAuditLog('USER_LOGIN', user.id, {
            email: user.email,
            role: user.role
        });

        // Générer le token
        const token = generateToken(user.id, user.email, user.role);

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    hederaAccountId: user.hederaAccountId,
                    additionalData: user.additionalData ? JSON.parse(user.additionalData) : {}
                }
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Si c'est un compte de démo
        if (userId.startsWith('demo-')) {
            const role = userId.replace('demo-', '');
            const demoAccount = demoAccounts.find(account => account.role === role);
            
            return res.json({
                success: true,
                data: {
                    user: {
                        id: userId,
                        email: demoAccount.email,
                        role: demoAccount.role,
                        name: demoAccount.name,
                        isDemo: true,
                        ...demoAccount
                    }
                }
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    hederaAccountId: user.hederaAccountId,
                    additionalData: user.additionalData ? JSON.parse(user.additionalData) : {},
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Audit log
        await hederaService.submitAuditLog('USER_LOGOUT', userId, {
            timestamp: new Date().toISOString()
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
};

module.exports = {
    register,
    login,
    getProfile,
    logout
};
