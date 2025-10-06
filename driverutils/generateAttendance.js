// utils/generateAttendance.js

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate mock attendance data for a given month/year
 * - Weekends → non-working
 * - 80–90% present probability
 * - Random absents sprinkled in
 * - If it's current month, mark future days as "upcoming"
 */
export function generateAttendance(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const date = new Date(year, month - 1, dayNum);
    const weekday = date.getDay(); // 0=Sunday, 6=Saturday

    // Weekend → non-working
    if (weekday === 0 || weekday === 6) {
      return { day: dayNum, status: "non-working" };
    }

    // If current month and this day is after today → upcoming
    if (isCurrentMonth && dayNum > today.getDate()) {
      return { day: dayNum, status: "upcoming" };
    }

    // Otherwise working day → mostly present
    const rand = Math.random();
    const presentThreshold = getRandomInt(80, 90) / 100; // 0.8 - 0.9
    const status = rand < presentThreshold ? "present" : "absent";

    return { day: dayNum, status };
  });
}
