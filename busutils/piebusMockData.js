// utils/pieMockData.js

// random int generator
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// helper → working days in a month (exclude Sat/Sun)
function getWorkingDays(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  let count = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const day = date.getDay(); // 0=Sun, 6=Sat
    if (day !== 0 && day !== 6) count++;
  }

  return count;
}

// Generate PieChart punctuality data
export function generatePieData(month, year) {
  const workingDays = getWorkingDays(month, year);

  // Distributions (approx %)
  const onTimePct = getRandomInt(55, 70);      // ~55–70% on time
  const slightDelayPct = getRandomInt(15, 25); // ~15–25% delay
  const latePct = 100 - onTimePct - slightDelayPct;

  // Values (days)
  const onTime = Math.round((onTimePct / 100) * workingDays);
  const slightDelay = Math.round((slightDelayPct / 100) * workingDays);
  const late = workingDays - (onTime + slightDelay); // remainder

  return [
    { name: "Ontime Entries", value: onTime, fill: "#56D2C3" },
    { name: "Slight Delay", value: slightDelay, fill: "#FBE46D" },
    { name: "Late Entries", value: late, fill: "#F76B6A" },
  ];
}
