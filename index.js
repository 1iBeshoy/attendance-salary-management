const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.set("view engine", "ejs");

// Import models
const { Attendance } = require("./models/Attendance");
const { Employees } = require("./models/Employees");
const { Salary } = require("./models/Salary");

// Import routes
const EmployeesRoute = require("./routes/Employees");
const AttendanceRoute = require("./routes/Attendance");
const SalaryRoute = require("./routes/Salary");
const PagesRoute = require("./routes/Pages");

// Define routes
app.use("/api/employees", EmployeesRoute);
app.use("/api/attendance", AttendanceRoute);
app.use("/api/salary", SalaryRoute);
app.use("/", PagesRoute);

// Database sync and server start
const startServer = async () => {
  try {
    await Employees.sync();
    await Attendance.sync();
    await Salary.sync();

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server started on port", process.env.PORT || 3006);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
