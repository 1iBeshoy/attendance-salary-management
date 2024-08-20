# Employee Attendance and Salary Management System

This project is a web-based system designed to manage employee attendance and calculate their salaries based on their work hours. The application is particularly suited for environments where tracking employee hours and managing payroll can be complex. The system allows for detailed tracking of arrival and departure times, calculates deductions and bonuses, and provides an intuitive interface for reviewing and updating employee attendance records.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Future Improvements](#future-improvements)
7. [License](#license)

---

## Project Overview

The primary goal of this project is to provide an efficient and user-friendly tool for tracking employee attendance and calculating salaries. This system was developed as a solution for a factory environment where accurate and timely payroll processing is critical.

The system allows factory management to:
- Track daily attendance, including the exact time of arrival and departure.
- Calculate work hours, including any overtime or early departures.
- Automatically compute salary deductions for late arrivals and bonuses for extra work hours.
- Maintain a historical record of attendance and salary data for reporting and auditing purposes.

This project was developed for a real-world application in a factory where my cousin works, ensuring it meets the practical needs of their an environment.

## Features

- **Employee Attendance Tracking:** Records the exact time of arrival and departure for each employee.
- **Shift Management:** Allows the definition of shift start and end times.
- **Salary Calculation:** Automatically calculates salary based on hours worked, deductions and bonuses.
- **Editable Attendance Records:** Managers can update attendance records directly from Employee's Attendance page.
- **Historical Data:** Access to historical attendance records filtered by date range.

## Tech Stack

- **Backend:** Node.js, Express.js, Sequelize (with SQLite for the database)
- **Frontend:** HTML, CSS, JavaScript (with EJS templates)
- **Utilities:** Custom utility functions for time calculations and date handling
- **Deployment:** Can be deployed on any Node.js-compatible hosting service

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1iBeshoy/attendance-salary-management.git
   cd attendance-salary-management
   ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up the database:**
  The system uses SQLite, so no additional setup is required. Sequelize will manage the database automatically.

4. **Start the application:**
   ```bash
   npm start
   ```
5. **Access the application:**
Open your web browser and navigate to `http://localhost:3000`.

## Usage
1. **Employee Arrival:** Register an employee's arrival time, shift start time, and salary per hour.
2. **Employee Departure:** Record the employee's departure time and shift end time, automatically calculating bonuses if applicable.
3. **Review Attendance Records:** Use the web interface to view and edit attendance records.
4. **Salary Calculation:** The system will automatically calculate salaries based on attendance data, taking into account any deductions or bonuses.

## Future Improvements

- **User Authentication:** Implement a login system to secure access to the management system.
- **Reporting Tools:** Add features for generating monthly or weekly reports.
- **Multi-Language Support:** Make the interface available in multiple languages.
- **Enhanced Analytics:** Provide graphical representations of attendance trends and payroll statistics.

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.
