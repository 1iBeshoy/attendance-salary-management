function getTimeDifference(startMillis, endMillis) {
    // Calculate the difference in milliseconds
    const diffMillis = endMillis - startMillis;
  
    // Calculate the difference in seconds, minutes, and hours
    const diffSeconds = Math.floor(diffMillis / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
  
    // Get the remaining minutes and seconds
    const remainingMinutes = diffMinutes % 60;
    const remainingSeconds = diffSeconds % 60;
  
    return {
      hours: diffHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
      milliseconds: diffMillis
    };
}

function getTotalHours(timeDifference) {
    return (timeDifference.hours + (timeDifference.minutes / 60) + (timeDifference.seconds / 3600)).toFixed(2);
};

function convertTo12Hour(time) {
  const [hour, minute] = time.split(':');
  let period = 'AM';
  let hour12 = parseInt(hour, 10);
  console.log(hour, hour12)

  if (hour12 >= 12) {
      period = 'PM';
      if (hour12 > 12) hour12 -= 12;
  } else if (hour12 === 0) {
      hour12 = 12;
  }

  return `${hour12.toString().padStart(2, '0')}:${minute} ${period}`;
}

function calculateHoursWorked(startMillis, endMillis) {
  const timeDiff = getTimeDifference(startMillis, endMillis);
  return timeDiff.hours + (timeDiff.minutes / 60);
}

function calculateWorkedHours(arrivedAt, leftAt) {
  const arrivedTimeMillis = new Date(arrivedAt).getTime();
  const leftTimeMillis = new Date(leftAt).getTime();
  
  const timeDiffMillis = leftTimeMillis - arrivedTimeMillis;

  if (timeDiffMillis < 0) {
      throw new Error("Invalid time range: 'leftAt' should be later than 'arrivedAt'");
  }

  const totalMinutes = Math.floor(timeDiffMillis / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Pad the hours and minutes with leading zeros if needed
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

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

module.exports = { getTimeDifference, getTotalHours, convertTo12Hour, calculateHoursWorked, calculateWorkedHours, convertTo24Hour };