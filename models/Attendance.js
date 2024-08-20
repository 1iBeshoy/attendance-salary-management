const { Sequelize, DataTypes } = require("sequelize");

const Attendance = new Sequelize({
    dialect: "sqlite",
    storage: "./database/Attendance.sql"
}).define("Attendance", {
    empCode: { type: DataTypes.INTEGER },
    day: { type: DataTypes.STRING },
    arrivedAt: { type: DataTypes.NUMBER },
    leftAt: { type: DataTypes.NUMBER },
    shiftStartTime: { type: DataTypes.INTEGER },
    shiftEndTime: { type: DataTypes.INTEGER },
    hours_worked: { type: DataTypes.STRING },
    deduction: { type: DataTypes.FLOAT },
    bonus: { type: DataTypes.FLOAT },
    salaryPerHour: { type: DataTypes.FLOAT },
}, { createdAt: true, updatedAt: true });

module.exports = { Attendance }