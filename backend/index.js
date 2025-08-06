const express = require("express");
const cors = require("cors");
require('dotenv').config();

const { sequelize, initializeDatabase } = require("./models/database");
const authRoutes = require("./routes/authRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const hederaService = require("./hedera/hederaService");

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 MediFlow API Server",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            health: "/api/health",
            auth: "/api/auth",
            prescriptions: "/api/prescriptions"
        }
    });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "MediFlow API is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        database: "Connected",
        hedera: hederaService.initialized ? "Connected" : "Demo Mode"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

// Initialisation et démarrage du serveur
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Initialiser Hedera
        await hederaService.initialize();
        
        // Initialiser la base de données
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`🚀 Serveur MediFlow démarré sur le port ${PORT}`);
            console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
            console.log(`🔐 Auth Endpoint: http://localhost:${PORT}/api/auth`);
            console.log(`💊 Prescriptions Endpoint: http://localhost:${PORT}/api/prescriptions`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
        });
    } catch (error) {
        console.error("❌ Erreur lors du démarrage du serveur:", error);
        process.exit(1);
    }
}

startServer();
