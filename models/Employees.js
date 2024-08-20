const { Sequelize, DataTypes } = require("sequelize");

const Employees = new Sequelize({
    dialect: "sqlite",
    storage: "./database/Employees.sql"
}).define("Employees", {
    code: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.INTEGER },
    address: { type: DataTypes.STRING },
    startDate: { type: DataTypes.INTEGER },
    endDate: { type: DataTypes.INTEGER },
    shiftStartTime: { type: DataTypes.INTEGER, allowNull: false },
    shiftEndTime: { type: DataTypes.INTEGER, allowNull: false },
    salaryPerHour: { type: DataTypes.FLOAT, allowNull: false },
    title: { type: DataTypes.STRING },
    deleted: { type: DataTypes.BOOLEAN }
}, { createdAt: true, updatedAt: true });

module.exports = { Employees };