const { Sequelize } = require('sequelize');
const path = require('path');

// Configuration de la base de données SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../prescriptions.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: false
    }
});

// Import des modèles
const User = require('./User')(sequelize);
const Prescription = require('./Prescription')(sequelize);

// Définition des associations
User.hasMany(Prescription, { 
    foreignKey: 'doctorId', 
    as: 'prescriptions' 
});

Prescription.belongsTo(User, { 
    foreignKey: 'doctorId', 
    as: 'doctor' 
});

Prescription.belongsTo(User, { 
    foreignKey: 'pharmacistId', 
    as: 'pharmacist' 
});

Prescription.belongsTo(User, { 
    foreignKey: 'driverId', 
    as: 'driver' 
});

// Fonction pour initialiser la base de données avec des données de test
const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        
        // Vérifier si des utilisateurs existent déjà
        const userCount = await User.count();
        
        if (userCount === 0) {
            console.log('🔄 Création des utilisateurs de démonstration...');
            
            const bcrypt = require('bcryptjs');
            const saltRounds = 12;
            const demoPassword = await bcrypt.hash('demo123', saltRounds);
            
            // Créer des utilisateurs de test
            await User.bulkCreate([
                {
                    email: 'doctor@hospital.com',
                    password: demoPassword,
                    firstName: 'Dr. Jean',
                    lastName: 'Dupont',
                    role: 'doctor',
                    isActive: true
                },
                {
                    email: 'pharmacist@pharmacy.com',
                    password: demoPassword,
                    firstName: 'Marie',
                    lastName: 'Martin',
                    role: 'pharmacist',
                    isActive: true
                },
                {
                    email: 'driver@delivery.com',
                    password: demoPassword,
                    firstName: 'Pierre',
                    lastName: 'Durand',
                    role: 'driver',
                    isActive: true
                },
                {
                    email: 'patient@email.com',
                    password: demoPassword,
                    firstName: 'Sophie',
                    lastName: 'Bernard',
                    role: 'patient',
                    isActive: true
                },
                {
                    email: 'admin@mediflow.com',
                    password: demoPassword,
                    firstName: 'Admin',
                    lastName: 'System',
                    role: 'admin',
                    isActive: true
                }
            ]);
            
            console.log('✅ Utilisateurs de démonstration créés');
        }
        
        console.log('✅ Base de données initialisée avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    User,
    Prescription,
    initializeDatabase
};
