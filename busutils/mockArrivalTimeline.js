// utils/mockArrivalTimeline.js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatebusArrivalTimeline(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month - 1, i + 1); // month - 1 because Date month is 0-indexed
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 0 || day === 6) {
      return null; // weekend → no data
    }

    const minute = getRandomInt(0, 59);
    // Always 8 AM + some minutes
    return 8 + minute / 60;
  });
}
