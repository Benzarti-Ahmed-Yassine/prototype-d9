const { Sequelize, DataTypes } = require('sequelize');

// Connexion à SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './prescriptions.sqlite'
});

// Modèle Prescription
const Prescription = sequelize.define('Prescription', {
  patientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  medication: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('prescribed', 'validated', 'delivered'),
    defaultValue: 'prescribed'
  },
  createdBy: {
    type: DataTypes.INTEGER // à adapter si vous avez une table User
  },
  blockchainRef: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = { sequelize, Prescription };