const express = require('express');
const { Salary } = require('../models/Salary');
const { Attendance } = require('../models/Attendance');
const { Op } = require("sequelize");

const SalaryRoute = express.Router();

const convertTimeToDecimal = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
};

// Fetch salaries for a specific employee
SalaryRoute.get('/:empCode', async (req, res) => {
    try {
        const salaries = await Salary.findAll({ where: { empCode: req.params.empCode } });
        res.json(salaries);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch salaries." });
    }
});

SalaryRoute.post('/', async (req, res) => {
    const { empCode, weekStart, weekEnd } = req.body;

    try {
        const attendances = await Attendance.findAll({
            where: {
                empCode,
                day: {
                    [Op.between]: [weekStart, weekEnd],
                }
            }
        });

        let totalHours = 0;
        let totalDeduction = 0;
        let totalBonus = 0;
        let totalSalary = 0;

        attendances.forEach((attendance) => {
            const hoursWorkedDecimal = convertTimeToDecimal(attendance.hours_worked);
            const dailySalary = hoursWorkedDecimal * attendance.salaryPerHour;
            totalHours += hoursWorkedDecimal;
            totalDeduction += attendance.deduction;
            totalBonus += attendance.bonus;
            totalSalary += dailySalary;
        });

        const finalSalary = totalSalary - totalDeduction + totalBonus;

        console.log(totalHours, totalDeduction, totalBonus, totalSalary, finalSalary)

        const newSalary = await Salary.create({
            empCode,
            weekStart,
            weekEnd,
            deduction: totalDeduction,
            bonus: totalBonus,
            salary: totalSalary,
            finalSalary,
        });

        res.json({ success: true, data: newSalary });
    } catch (err) {
        res.status(500).send({ error: "Failed to add salary record." });
    }
});

module.exports = SalaryRoute;