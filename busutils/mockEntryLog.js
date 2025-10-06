// utils/mockEntryLog.js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateEntryLogData(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const logs = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month - 1, day); // month-1 since JS Date is 0-based
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat

    // skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // random base time ~ 8:00 AM
    const hour = 8;
    const minute = getRandomInt(0, 59);
    const entryTime = `${hour}:${minute.toString().padStart(2, "0")} AM`;

    // check late: after 8:30
    const isLate = minute > 30;
    const delay = isLate ? minute - 30 : 0;

    logs.push({
      date: `${day}/${month}/${year}`,
      entryTime,
      status: isLate ? "Late" : "On Time",
      delay: delay.toString(), // delay in minutes
    });
  }

  return logs;
}
