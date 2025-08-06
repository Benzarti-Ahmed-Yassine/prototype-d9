const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../prescriptions.sqlite'),
    logging: console.log
});

module.exports = { sequelize };
