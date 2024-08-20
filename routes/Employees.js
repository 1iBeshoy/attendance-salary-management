const express = require("express");
const EmployeesRoute = express.Router();

const { Employees } = require("../models/Employees");

EmployeesRoute.get("/", async(req, res) => { 
    const employeeCode = req.query.employeeCode;

    let filter = {};
    if(employeeCode) filter.code = employeeCode;

    const result = await Employees.findAll({ where: filter });

    res.status(200).json({ success: true, data: result });
});

EmployeesRoute.post("/", async(req, res) => {
    const { code, name, phone, address, startData, endDate, shiftStartTime, shiftEndTime, salaryPerHour, title } = req.body;

    let filter = {};
    if(name) filter.name = name;
    if(phone) filter.phone = phone;
    if(address) filter.address = address;
    if(startData) filter.startData = startData;
    if(endDate) filter.endDate = endDate;
    if(shiftStartTime) filter.shiftStartTime = shiftStartTime;
    if(shiftEndTime) filter.shiftEndTime = shiftEndTime;
    if(salaryPerHour) filter.salaryPerHour = salaryPerHour;
    if(title) filter.title = title;

    if(code) {
        let exsistingEmployee = await Employees.findAll({ where: { code: code } });
        if(exsistingEmployee) {
            Employees.update(filter, { where: { code: code } }).then(() => {
                return res.json({ success: true, message: "updated." });
            }).catch((err) => {
                console.error(err);
                return res.json({ success: false, message: "Error." });            
            });

            return;
        }
    }

    let newCode;
    let exsistingEmployee;

    do {
        newCode = Math.floor(1000 + Math.random() * 9000);
        exsistingEmployee = await Employees.findAll({ where: { code: newCode } });
    } while (exsistingEmployee.length !== 0);
  

    filter.code = newCode;

    Employees.create(filter).then(() => {
        return res.json({ success: true, message: "created." });
    }).catch((err) => {
        console.error(err);
        return res.json({ success: false, message: "Error." });            
    });
})

module.exports = EmployeesRoute;