document.addEventListener("DOMContentLoaded", function() {
    const requiredFields = document.querySelectorAll("input[required]");

    requiredFields.forEach(field => {
        const label = document.querySelector(`label[for="${field.name}"]`);
        if (label) {
            const asterisk = document.createElement("span");
            asterisk.classList.add("text-red-500");
            asterisk.style.fontSize = "15px";
            asterisk.style.fontWeight = "bold";
            asterisk.textContent = " *";
            label.appendChild(asterisk);
        }
    });

    ["arriveTime", "leftTime"].forEach(name => {
        let field = document.getElementById(name);
        if(field) {
            const now = new Date();
    
            // Extract the year, month, day, hour, and minute
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            
            // Format the date and time as YYYY-MM-DDTHH:MM
            const formattedDateTime = `${year}-${month}-${day}T${hour}:${minute}`;
            
            field.value = formattedDateTime;
        }
    })
});

function convertTo12Hour(time) {
    const [hour, minute] = time.split(':');
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
};

function convertTimeToDecimal(hoursMinutes) {
    const [hours, minutes] = hoursMinutes.split(':').map(Number);
    return hours + (minutes / 60);
};

function convertTo24Hour(timeString) {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
  
    let hoursNum = parseInt(hours, 10);
  
    if (period === 'PM' && hoursNum !== 12) {
      hoursNum += 12;
    } else if (period === 'AM' && hoursNum === 12) {
      hoursNum = 0;
    }
  
    const formattedHours = String(hoursNum).padStart(2, '0');
    return `${formattedHours}:${minutes}`;
}