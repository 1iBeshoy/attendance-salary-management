const { Sequelize, DataTypes } = require("sequelize");

const Salary = new Sequelize({
    dialect: "sqlite",
    storage: "./database/Salary.sql"
}).define("Salary", {
    empCode: { type: DataTypes.INTEGER },
    weekStart: { type: DataTypes.STRING },
    weekEnd: { type: DataTypes.STRING },
    deduction: { type: DataTypes.FLOAT },
    bonus: { type: DataTypes.FLOAT },
    salary: { type: DataTypes.FLOAT },
    finalSalary: { type: DataTypes.FLOAT },
}, { createdAt: true, updatedAt: true });

module.exports = { Salary };