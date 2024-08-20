document.addEventListener("DOMContentLoaded", async () => {
    const employeeList = document.getElementById("employeesList");

    try {
        const response = await fetch("/api/employees");
        const employees = await response.json().then(res => res.data);

        employees.forEach(employee => {
            const employeeItem = document.createElement('li');
            employeeItem.className = 'employee-item';

            const employeeDetails = `
                <div class="employee-details">
                    <span>${employee.name}</span>
                    ${employee.title ? `<span>${employee.title}</span>` : ''}
                    <span>${employee.salaryPerHour} EGP</span>
                </div>
            `;

            const employeeActions = `
                <div class="employee-actions">
                    <button onclick="redirect(${employee.code}, 'arrive')">Arrived</button>
                    <button onclick="redirect(${employee.code}, 'left')">Left</button>
                    <button onclick="redirect(${employee.code}, 'attendance')">Attend List</button>
                    <button onclick="redirect(${employee.code}, 'salary')">Salary</button>
                    <button onclick="redirect(${employee.code}, 'edit')">Edit</button>
                </div>
            `;

            employeeItem.innerHTML = employeeDetails + employeeActions;
            employeeList.appendChild(employeeItem);
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
});

document.getElementById("create").addEventListener("click", () => window.location.href = "/employees/create");

function redirect(code, destination) {
    window.location.href = `employee/${code}/${destination}`;
}