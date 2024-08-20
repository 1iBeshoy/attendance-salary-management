document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("attendanceTableBody");
  const fromDateInput = document.getElementById("fromDate");
  const toDateInput = document.getElementById("toDate");
  const filterButton = document.getElementById("filterButton");

  const code = document.getElementsByTagName("option")[0].id;

  // Load data for the last 7 days by default
  const loadDefaultData = async () => {
    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() - 7));

    fromDateInput.value = priorDate.toISOString().split("T")[0];
    toDateInput.value = today.toISOString().split("T")[0];

    await loadData(priorDate.toISOString().split("T")[0], today.toISOString().split("T")[0]);
  };

  // Load data based on the date range
  const loadData = async (fromDate, toDate) => {
    const response = await fetch(`/api/attendance/${code}?from=${fromDate}&to=${toDate}`);
    const data = await response.json().then((res) => res.data);
    tableBody.innerHTML = ''; // Clear the table before adding new rows

    data.forEach((record) => {
      const row = document.createElement("tr");

      const createCell = (text, fieldName, editable) => {
        const cell = document.createElement("td");
        cell.textContent = text;
        if (editable)
          cell.addEventListener("dblclick", () =>
            makeEditable(cell, record, fieldName)
          );
        row.appendChild(cell);
        return cell;
      };

      createCell(record.day, "day");
      createCell(convertTo12Hour(record.arrivedAt.split("T")[1]), "arrivedAt", true);
      createCell(record.leftAt ? convertTo12Hour(record.leftAt.split("T")[1]) : "N/A", "leftAt", true);
      createCell(convertTo12Hour(record.shiftStartTime), "shiftStartTime", true);
      createCell(record.shiftEndTime ? convertTo12Hour(record.shiftEndTime) : "N/A", "shiftEndTime", true);
      createCell(record.hours_worked ? `${record.hours_worked} hours` : "N/A", "hours_worked");
      createCell(`${record.deduction.toFixed(2)} EGP`, "deduction");
      createCell(record.bonus ? `${record.bonus.toFixed(2)} EGP` : "0.00 EGP", "bonus");
      createCell(`${record.salaryPerHour.toFixed(2)} EGP`, "salaryPerHour", true);
      createCell(calculateFinalSalary(record), "finalSalary");

      tableBody.appendChild(row);
    });
  };

  // Update table data when filter button is clicked
  filterButton?.addEventListener("click", async () => {
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;

    if (fromDate && toDate) {
      await loadData(fromDate, toDate);
    } else {
      alert("Please select both from and to dates.");
    }
  });

  // Load default data on page load
  await loadDefaultData();
  

  const makeEditable = (cell, record, fieldName) => {
    const originalValue = cell.textContent;
    cell.setAttribute("data-original", originalValue);

    let input;

    if (fieldName === "arrivedAt" || fieldName === "leftAt" || fieldName === "shiftStartTime" || fieldName === "shiftEndTime") {
        input = document.createElement("input");
        input.type = "time";
        input.value = convertTo24Hour(originalValue);
    } else if (fieldName === "salaryPerHour") {
        input = document.createElement("input");
        input.type = "number";
        input.value = parseFloat(originalValue);
    } else {
        input = document.createElement("input");
        input.type = "text";
        input.value = originalValue;
    }

    input.className = "editable-input";

    input.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            const newValue = input.value;
            cell.textContent = fieldName.includes("Time") ? convertTo12Hour(newValue) : newValue;
            await updateRecord(record, fieldName, newValue);
        } else if (event.key === "Escape") {
            cancelEdit(cell);
        }
    });

    cell.textContent = "";
    cell.appendChild(input);
    input.focus();
  };

  const cancelEdit = (cell) => {
    const originalValue = cell.getAttribute("data-original");
    cell.innerHTML = originalValue;
    cell.classList.remove("editing");
  };

  const updateRow = (updatedData) => {
    const row = [...tableBody.children].find((row) => row.children[0].innerHTML === updatedData.data.day);

    if (row) {
      row.children[1].textContent = convertTo12Hour(updatedData.data.arrivedAt.split('T')[1]);
      row.children[2].textContent = updatedData.data.leftAt ? convertTo12Hour(updatedData.data.leftAt.split('T')[1]) : "N/A";
      row.children[3].textContent = convertTo12Hour(updatedData.data.shiftStartTime);
      row.children[4].textContent = updatedData.data.shiftEndTime ? convertTo12Hour(updatedData.data.shiftEndTime) : "N/A";
      row.children[5].textContent = updatedData.data.hours_worked ? `${updatedData.data.hours_worked} hours` : "N/A";
      row.children[6].textContent = `${updatedData.data.deduction.toFixed(2)} EGP`;
      row.children[7].textContent = updatedData.data.bonus ? `${updatedData.data.bonus.toFixed(2)} EGP` : "0.00 EGP";
      row.children[8].textContent = `${updatedData.data.salaryPerHour.toFixed(2)} EGP`;
      row.children[9].textContent = calculateFinalSalary(updatedData.data);
    }
  };

  const updateRecord = async (record, fieldName, newValue,) => {
    try {
      const response = await fetch(`/api/attendance/${record.empCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: fieldName, value: newValue, day: record.day }),
      });

      response.json().then((res) => {
        if(res.success) {
          updateRow(res);
        } else {
          alert(res.message);
        }
      })

      // Update related fields in the row
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };
});

const calculateFinalSalary = (record) => {
  if (record.leftAt) {
    const finalSalary =
      convertTimeToDecimal(record.hours_worked) * record.salaryPerHour -
      record.deduction +
      record.bonus;
    return `${finalSalary.toFixed(2)} EGP`;
  }
  return "0.00 EGP";
};