const { Prescription, User } = require('../models/database');
const hederaService = require('../hedera/hederaService');

class PrescriptionController {
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};
            
            // Filtrer par rôle utilisateur
            if (req.user.role === 'doctor') {
                whereClause.doctorId = req.user.userId;
            } else if (req.user.role === 'pharmacist') {
                whereClause.pharmacistId = req.user.userId;
            } else if (req.user.role === 'driver') {
                whereClause.driverId = req.user.userId;
            }

            // Filtrer par statut si spécifié
            if (status) {
                whereClause.status = status;
            }

            const prescriptions = await Prescription.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'doctor',
                        attributes: ['firstName', 'lastName', 'email']
                    },
                    {
                        model: User,
                        as: 'pharmacist',
                        attributes: ['firstName', 'lastName', 'email'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'driver',
                        attributes: ['firstName', 'lastName', 'email'],
                        required: false
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                data: prescriptions.rows,
                pagination: {
                    total: prescriptions.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(prescriptions.count / limit)
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des prescriptions:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const prescription = await Prescription.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'doctor',
                        attributes: ['firstName', 'lastName', 'email']
                    },
                    {
                        model: User,
                        as: 'pharmacist',
                        attributes: ['firstName', 'lastName', 'email'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'driver',
                        attributes: ['firstName', 'lastName', 'email'],
                        required: false
                    }
                ]
            });

            if (!prescription) {
                return res.status(404).json({
                    success: false,
                    message: 'Prescription non trouvée'
                });
            }

            // Vérifier les permissions
            if (req.user.role === 'doctor' && prescription.doctorId !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé'
                });
            }

            res.json({
                success: true,
                data: prescription
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async create(req, res) {
        try {
            const {
                patientName,
                patientAge,
                medication,
                dosage,
                frequency,
                duration,
                instructions,
                deliveryAddress
            } = req.body;

            // Validation
            if (!patientName || !patientAge || !medication || !dosage || !frequency || !duration) {
                return res.status(400).json({
                    success: false,
                    message: 'Tous les champs obligatoires doivent être remplis'
                });
            }

            // Calculer la date d'expiration (30 jours par défaut)
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            const prescription = await Prescription.create({
                doctorId: req.user.userId,
                patientName,
                patientAge: parseInt(patientAge),
                medication,
                dosage,
                frequency,
                duration,
                instructions,
                deliveryAddress,
                expiryDate,
                status: 'pending'
            });

            // Log audit sur Hedera
            await hederaService.logPrescriptionCreated(prescription);

            const prescriptionWithDoctor = await Prescription.findByPk(prescription.id, {
                include: [
                    {
                        model: User,
                        as: 'doctor',
                        attributes: ['firstName', 'lastName', 'email']
                    }
                ]
            });

            res.status(201).json({
                success: true,
                message: 'Prescription créée avec succès',
                data: prescriptionWithDoctor
            });
        } catch (error) {
            console.error('Erreur lors de la création de la prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const prescription = await Prescription.findByPk(id);
            if (!prescription) {
                return res.status(404).json({
                    success: false,
                    message: 'Prescription non trouvée'
                });
            }

            // Vérifier les permissions
            if (req.user.role === 'doctor' && prescription.doctorId !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé'
                });
            }

            // Sauvegarder l'état précédent pour l'audit
            const previousState = { ...prescription.dataValues };

            await prescription.update(updates);

            // Log audit
            await hederaService.logPrescriptionUpdated({
                id: prescription.id,
                updatedBy: req.user.userId,
                changes: updates,
                previousState
            });

            const updatedPrescription = await Prescription.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'doctor',
                        attributes: ['firstName', 'lastName', 'email']
                    },
                    {
                        model: User,
                        as: 'pharmacist',
                        attributes: ['firstName', 'lastName', 'email'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'driver',
                        attributes: ['firstName', 'lastName', 'email'],
                        required: false
                    }
                ]
            });

            res.json({
                success: true,
                message: 'Prescription mise à jour avec succès',
                data: updatedPrescription
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const prescription = await Prescription.findByPk(id);
            if (!prescription) {
                return res.status(404).json({
                    success: false,
                    message: 'Prescription non trouvée'
                });
            }

            // Vérifier les permissions
            if (req.user.role === 'doctor' && prescription.doctorId !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé'
                });
            }

            // Log audit avant suppression
            await hederaService.submitAuditLog('PRESCRIPTION_DELETED', {
                prescriptionId: prescription.id,
                deletedBy: req.user.userId,
                prescriptionData: prescription.dataValues
            });

            await prescription.destroy();

            res.json({
                success: true,
                message: 'Prescription supprimée avec succès'
            });
        } catch (error) {
            console.error('Erreur lors de la suppression de la prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
}

module.exports = new PrescriptionController();
