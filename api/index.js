const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// In-memory storage for demo (replace with database in production)
let users = [
  {
    id: 1,
    email: 'doctor@hospital.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'doctor',
    name: 'Dr. Martin Dubois'
  },
  {
    id: 2,
    email: 'pharmacist@pharmacy.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'pharmacist',
    name: 'Marie Pharmacienne'
  },
  {
    id: 3,
    email: 'patient@email.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
    role: 'patient',
    name: 'Jean Patient'
  }
];

let prescriptions = [
  {
    id: 1,
    patientName: 'Jean Patient',
    medication: 'Paracétamol 500mg',
    dosage: '1 comprimé 3 fois par jour',
    duration: '7 jours',
    doctorName: 'Dr. Martin Dubois',
    status: 'active',
    createdAt: new Date().toISOString(),
    hederaTransactionId: 'demo-tx-001'
  }
];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MediFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' });
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

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role
    };

    users.push(newUser);

    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        name: newUser.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Prescription routes
app.get('/api/prescriptions', authenticateToken, (req, res) => {
  try {
    let userPrescriptions = prescriptions;

    // Filter based on user role
    if (req.user.role === 'patient') {
      userPrescriptions = prescriptions.filter(p => 
        p.patientName.toLowerCase().includes(req.user.name.toLowerCase())
      );
    }

    res.json(userPrescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/prescriptions', authenticateToken, (req, res) => {
  try {
    const { patientName, medication, dosage, duration } = req.body;

    if (!patientName || !medication || !dosage || !duration) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const newPrescription = {
      id: prescriptions.length + 1,
      patientName,
      medication,
      dosage,
      duration,
      doctorName: req.user.name,
      status: 'active',
      createdAt: new Date().toISOString(),
      hederaTransactionId: `demo-tx-${Date.now()}`
    };

    prescriptions.push(newPrescription);
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/prescriptions/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { patientName, medication, dosage, duration, status } = req.body;

    const prescriptionIndex = prescriptions.findIndex(p => p.id === parseInt(id));
    if (prescriptionIndex === -1) {
      return res.status(404).json({ message: 'Prescription non trouvée' });
    }

    prescriptions[prescriptionIndex] = {
      ...prescriptions[prescriptionIndex],
      patientName: patientName || prescriptions[prescriptionIndex].patientName,
      medication: medication || prescriptions[prescriptionIndex].medication,
      dosage: dosage || prescriptions[prescriptionIndex].dosage,
      duration: duration || prescriptions[prescriptionIndex].duration,
      status: status || prescriptions[prescriptionIndex].status,
      updatedAt: new Date().toISOString()
    };

    res.json(prescriptions[prescriptionIndex]);
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.delete('/api/prescriptions/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const prescriptionIndex = prescriptions.findIndex(p => p.id === parseInt(id));
    
    if (prescriptionIndex === -1) {
      return res.status(404).json({ message: 'Prescription non trouvée' });
    }

    prescriptions.splice(prescriptionIndex, 1);
    res.json({ message: 'Prescription supprimée avec succès' });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Export for Vercel
module.exports = app;
