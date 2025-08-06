const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import models and services
const { initializeDatabase } = require('../backend/models/database');
const User = require('../backend/models/User');
const Prescription = require('../backend/models/Prescription');
const { submitToHedera } = require('../backend/hedera/hederaService');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'mediflow-secret-key-2024';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log audit to Hedera
    try {
      await submitToHedera({
        type: 'USER_LOGIN',
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
        ip: req.ip
      });
    } catch (hederaError) {
      console.warn('Hedera audit failed:', hederaError.message);
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient'
    });

    // Log audit to Hedera
    try {
      await submitToHedera({
        type: 'USER_REGISTRATION',
        userId: userId,
        email: email,
        role: role || 'patient',
        timestamp: new Date().toISOString()
      });
    } catch (hederaError) {
      console.warn('Hedera audit failed:', hederaError.message);
    }

    const token = jwt.sign(
      { 
        id: userId, 
        email, 
        role: role || 'patient',
        name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        name,
        role: role || 'patient'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Prescription routes
app.get('/api/prescriptions', authenticateToken, async (req, res) => {
  try {
    const prescriptions = await Prescription.findByUserId(req.user.id);
    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/prescriptions', authenticateToken, async (req, res) => {
  try {
    const { patientName, medication, dosage, frequency, duration, notes } = req.body;

    if (!patientName || !medication || !dosage || !frequency || !duration) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    const prescriptionId = await Prescription.create({
      doctorId: req.user.id,
      patientName,
      medication,
      dosage,
      frequency,
      duration,
      notes: notes || '',
      status: 'active'
    });

    // Log audit to Hedera
    try {
      await submitToHedera({
        type: 'PRESCRIPTION_CREATED',
        prescriptionId: prescriptionId,
        doctorId: req.user.id,
        patientName: patientName,
        medication: medication,
        timestamp: new Date().toISOString()
      });
    } catch (hederaError) {
      console.warn('Hedera audit failed:', hederaError.message);
    }

    const prescription = await Prescription.findById(prescriptionId);
    res.status(201).json(prescription);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/prescriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { patientName, medication, dosage, frequency, duration, notes, status } = req.body;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription non trouvée' });
    }

    if (prescription.doctorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    await Prescription.update(id, {
      patientName,
      medication,
      dosage,
      frequency,
      duration,
      notes,
      status
    });

    // Log audit to Hedera
    try {
      await submitToHedera({
        type: 'PRESCRIPTION_UPDATED',
        prescriptionId: id,
        doctorId: req.user.id,
        changes: { patientName, medication, dosage, frequency, duration, notes, status },
        timestamp: new Date().toISOString()
      });
    } catch (hederaError) {
      console.warn('Hedera audit failed:', hederaError.message);
    }

    const updatedPrescription = await Prescription.findById(id);
    res.json(updatedPrescription);
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/prescriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription non trouvée' });
    }

    if (prescription.doctorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    await Prescription.delete(id);

    // Log audit to Hedera
    try {
      await submitToHedera({
        type: 'PRESCRIPTION_DELETED',
        prescriptionId: id,
        doctorId: req.user.id,
        timestamp: new Date().toISOString()
      });
    } catch (hederaError) {
      console.warn('Hedera audit failed:', hederaError.message);
    }

    res.json({ message: 'Prescription supprimée avec succès' });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Export for Vercel
module.exports = app;
