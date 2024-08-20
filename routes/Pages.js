const express = require('express');
const { Employees } = require('../models/Employees');

const PagesRoute = express.Router();

const checkEmployeeCode = async(req, res, next) => {
    const empCode = req.params.code;
    if(!empCode) return res.redirect("/employees");

    const employee = await Employees.findOne({ where: { code: empCode }});
    if(!employee) return res.redirect("/employees");

    next();
}

PagesRoute.get("/", (req, res) => {
    res.render("employees");
});

PagesRoute.get("/employees", (req, res) => {
    res.render("employees");
});

PagesRoute.get("/employees/create", (req, res) => {
    res.render("Employees/create");
});

PagesRoute.get("/employee/:code/edit", checkEmployeeCode, (req, res) => {
    res.render("Employees/edit", {
        code: req.params.code
    });
});


PagesRoute.get("/employee/:code/arrive", checkEmployeeCode, async(req, res) => {
    const employee = await Employees.findOne({ where: { code: req.params.code }});
    res.render("Attendance/arrive", {
        code: req.params.code,
        shiftStartTime: employee.shiftStartTime,
        salaryPerHour: employee.salaryPerHour
    });
});

PagesRoute.get("/employee/:code/left", checkEmployeeCode, async(req, res) => {
    const employee = await Employees.findOne({ where: { code: req.params.code }});
    res.render("Attendance/left", {
        code: req.params.code,
        shiftEndTime: employee.shiftEndTime,
    });
});

PagesRoute.get("/employee/:code/attendance", checkEmployeeCode, async(req, res) => {
    res.render("Attendance/attendance", {
        code: req.params.code
    })
});

PagesRoute.get("/employee/:code/salary", checkEmployeeCode, async(req, res) => {
    res.render("Employees/salary", {
        code: req.params.code
    })
})

module.exports = PagesRoute;