document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("salaryTableBody");
    const addSalaryButton = document.getElementById("addSalaryButton");
    const weekStartInput = document.getElementById("weekStart");
    const weekEndInput = document.getElementById("weekEnd");
    
    const code = document.getElementsByTagName("option")[0].id;

    const loadSalaryData = async () => {
        const response = await fetch(`/api/salary/${code}`);
        const data = await response.json();
        tableBody.innerHTML = ''; // Clear the table before adding new rows

        data.forEach((record) => {
            const row = document.createElement("tr");

            const createCell = (text) => {
                const cell = document.createElement("td");
                cell.textContent = text;
                row.appendChild(cell);
            };

            createCell(record.weekStart);
            createCell(record.weekEnd);
            createCell(`${record.deduction.toFixed(2)} EGP`);
            createCell(`${record.bonus.toFixed(2)} EGP`);
            createCell(`${record.salary.toFixed(2)} EGP`);
            createCell(`${record.finalSalary.toFixed(2)} EGP`);

            tableBody.appendChild(row);
        });
    };

    addSalaryButton.addEventListener("click", async () => {
        const weekStart = weekStartInput.value;
        const weekEnd = weekEndInput.value;

        if (!weekStart || !weekEnd) {
            alert("Please select both week start and end dates.");
            return;
        }

        const response = await fetch(`/api/salary`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ empCode: code, weekStart, weekEnd }),
        });

        if (response.ok) {
            alert("Salary added successfully!");
            await loadSalaryData(); // Reload the salary data after adding a new record
        } else {
            alert("Failed to add salary. Please try again.");
        }
    });

    // Load salary data on page load
    await loadSalaryData();
});
