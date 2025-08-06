const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Prescription = sequelize.define('Prescription', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        patientName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        patientAge: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        medication: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dosage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        frequency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false
        },
        instructions: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'dispensed', 'delivered', 'completed'),
            defaultValue: 'pending'
        },
        prescriptionDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        expiryDate: {
            type: DataTypes.DATE
        },
        pharmacistId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        driverId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        deliveryAddress: {
            type: DataTypes.TEXT
        },
        notes: {
            type: DataTypes.TEXT
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'prescriptions',
        timestamps: true
    });

    return Prescription;
};
