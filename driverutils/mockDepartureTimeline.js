// utils/mockDepartureTimeline.js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDepartureTimeline(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month - 1, i + 1); // month - 1 because Date month is 0-indexed
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 0 || day === 6) {
      return null; // weekend → no data
    }

    // Random minute between 15 and 30 to simulate 7:15 AM to 7:30 AM
    const minute = getRandomInt(15, 30);

    // Convert to decimal hours (e.g., 7.25 = 7:15 AM)
    return 7 + minute / 60;
  });
}
