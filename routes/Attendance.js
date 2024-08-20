const express = require("express");
const { Op } = require("sequelize");
const AttendanceRoute = express.Router();

const { Attendance } = require("../models/Attendance");
const { Employees } = require("../models/Employees");

const { getTimeDifference, getTotalHours, calculateHoursWorked, calculateWorkedHours, convertTo24Hour } = require("../utils/timeUtils");

function calculateDeduction(arrivedAtMillis, shiftStartMillis, salaryPerHour) {
    if (shiftStartMillis < arrivedAtMillis) {
        const delay = getTimeDifference(shiftStartMillis, arrivedAtMillis);
        return getTotalHours(delay) * salaryPerHour;
    }
    return 0;
}

function calculateBonus(leftAtMillis, shiftEndMillis, salaryPerHour) {
    if (shiftEndMillis < leftAtMillis) {
        const extraHours = getTotalHours(getTimeDifference(shiftEndMillis, leftAtMillis));
        return extraHours * salaryPerHour;
    }
    return 0;
}

const updateFieldHandlers = {
    arrivedAt: (record, value, day) => {
        const arrivedMillis = new Date(value).getTime();
        const shiftStartMillis = new Date(`${day}T${record.shiftStartTime}`).getTime();
        record.deduction = calculateDeduction(arrivedMillis, shiftStartMillis, record.salaryPerHour);
        if(record.leftAt) record.hours_worked = calculateWorkedHours(value, record.leftAt);
    },
    leftAt: (record, value, day) => {
        const leftMillis = new Date(value).getTime();
        const shiftEndMillis = new Date(`${day}T${record.shiftEndTime}`).getTime();
        record.bonus = calculateBonus(leftMillis, shiftEndMillis, record.salaryPerHour);
        record.hours_worked = calculateWorkedHours(record.arrivedAt, value);
    },
    shiftStartTime: (record, value, day) => {
        const shiftStartMillis = new Date(`${day}T${value}:00`).getTime();
        const arrivedMillis = new Date(record.arrivedAt).getTime();
        record.deduction = calculateDeduction(arrivedMillis, shiftStartMillis, record.salaryPerHour);
    },
    shiftEndTime: (record, value, day) => {
        const shiftEndMillis = new Date(`${day}T${value}:00`).getTime();
        const leftMillis = new Date(record.leftAt).getTime();
        record.bonus = calculateBonus(leftMillis, shiftEndMillis, record.salaryPerHour);
    },
    salaryPerHour: (record, value, day) => {
        record.deduction = calculateDeduction(new Date(record.arrivedAt).getTime(), new Date(`${day}T${record.shiftStartTime}`).getTime(), value);
        record.bonus = calculateBonus(new Date(record.leftAt).getTime(), new Date(`${day}T${record.shiftEndTime}`).getTime(), value);
    }
};

AttendanceRoute.post("/arrive/:code", async(req, res) => {
    const empCode = req.params.code;
    const { arriveTime, shiftStart, salaryPerHour } = req.body;

    const day = arriveTime.split('T')[0];

    const employee = await Employees.findOne({ where: { code: empCode }});
    if(!employee) return res.json({ success: false, message: "Employee does not exist." })

    const attendDay = await Attendance.findOne({ where: { empCode: empCode, day: day }});
    if(attendDay?.arrivedAt != null) return res.json({ success: false, message: "Attendance has already been registered" });

    const data = {
        empCode,
        day,
        arrivedAt: arriveTime,
        shiftStartTime: shiftStart,
        salaryPerHour
    };

    const attend = await Attendance.create(data);
    if(!attend.dataValues.empCode) return res.json({ success: false, message: "Error while saving the data."});
    
    updateFieldHandlers.arrivedAt(attend, arriveTime, day);
    await attend.save();

    res.json({ success: true, message: "Saved." });
});

AttendanceRoute.post("/left/:code", async (req, res) => {
    const empCode = req.params.code;
    const { leftTime, shiftEnd } = req.body;

    const day = leftTime.split('T')[0];

    const employee = await Employees.findOne({ where: { code: empCode } });
    if (!employee) return res.status(404).json({ success: false, message: "Employee does not exist." });

    const attendDay = await Attendance.findOne({ where: { empCode, day } });
    if (!attendDay) return res.status(400).json({ success: false, message: "Employee has not arrived that day." });
    if (attendDay.leftAt) return res.status(400).json({ success: false, message: "Employee already left." });

    attendDay.leftAt = leftTime;
    attendDay.shiftEndTime = shiftEnd;

    updateFieldHandlers.leftAt(attendDay, leftTime, day);
    await attendDay.save();

    res.json({ success: true, message: "Saved" });
});

AttendanceRoute.put("/:code", async (req, res) => {
    const empCode = req.params.code;
    const { field, value, day } = req.body;

    if (!Object.keys(updateFieldHandlers).includes(field)) {
        return res.status(400).json({ success: false, message: "Invalid field" });
    }
    
    try {
        const attendRecord = await Attendance.findOne({ where: { empCode, day } });
        if (!attendRecord) return res.status(404).json({ success: false, message: "Record not found" });

        let parsedValue;
        if(field == "arrivedAt" || field == "leftAt") parsedValue = `${day}T${convertTo24Hour(value)}`;
        else if(field == "shiftStartTime" || field == "shiftEndTime") parsedValue = convertTo24Hour(value);
        else parsedValue = parseFloat(value);
  
        attendRecord[field] = parsedValue;

        if((field == "leftAt" || field == "shiftEndTime") && (!attendRecord.leftAt || !attendRecord.shiftEndTime)) {
            return res.status(400).json({ success: false, message: "Cannot update leave fields before they are initially set." });
        }

        updateFieldHandlers[field](attendRecord, parsedValue, day);

        await attendRecord.save();
        res.json({ success: true, message: "Record updated", data: attendRecord });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

AttendanceRoute.get("/:code", async(req, res) => {
    let empCode = req.params.code;
    let { day, from, to } = req.query;

    const employee = await Employees.findAll({ where: { code: empCode }});
    if(!employee) return res.json({ success: false, message: "Employee does not exist." })

    let filter = { where: { empCode: empCode } };
    if(from && to) filter.where.day = { [Op.between]: [from, to] };
    if(day) filter.where.day = day;

    const result = await Attendance.findAll(filter);

    res.json({ success: true, data: result });
});

module.exports = AttendanceRoute;