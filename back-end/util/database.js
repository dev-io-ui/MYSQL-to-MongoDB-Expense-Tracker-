const Sequelize = require('sequelize');

const sequelize = new Sequelize('Expense-Tracker-app','root','root',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;