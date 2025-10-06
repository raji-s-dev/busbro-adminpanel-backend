import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";  

import { generateEntryLogData } from "./busutils/mockEntryLog.js";
import { generateArrivalTimeline } from "./busutils/mockArrivalTimeline.js";
import { generatePieData } from "./busutils/piebusMockData.js";

import { generateAttendance } from "./driverutils/generateAttendance.js";
import { generateDepartureTimeline } from "./driverutils/mockDepartureTimeline.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Path helper (safer with resolve)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockPath = (file) => path.join(__dirname, "mockbus", file);


// ✅ Serve static driver images
app.use("/images", express.static(path.join(__dirname, "public/images")));















//buses

// 1️⃣ Get all buses
app.get("/api/buses", (req, res) => {
  const buses = JSON.parse(fs.readFileSync(mockPath("buses.json"), "utf-8"));
  res.json(buses);
});
// 2️⃣ Get details of one bus
app.get("/api/buses/:id", (req, res) => {
  let busId = req.params.id;

  // Map numeric ids → busN
  if (!busId.startsWith("bus")) {
    busId = "bus" + busId;
  }
 // 🔹 New path — now look inside mock/busdetails
  const file = path.join(__dirname, "mockbus", "busdetails", `${busId}.json`);
  

  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: "Bus not found" });
  }

  const details = JSON.parse(fs.readFileSync(file, "utf-8"));


  // Load external route JSON (westmambalam.json)
const routeFile = path.join(__dirname, "mockbus", "busroutes", `${busId}.json`);

const routeData = fs.existsSync(routeFile)
  ? JSON.parse(fs.readFileSync(routeFile, "utf-8"))
  : details.route; // fallback to embedded route

  // ✅ Dynamic driver photo assignment
const numericId = (details.busId || busId).replace("bus", ""); 
const driverWithPhoto = {
  ...details.driver,
  photo: `${req.protocol}://${req.get("host")}/images/drivers/driver${numericId}.png`,
};

  // ✅ Split into sections
  res.json({
    busData: {
      busId: details.busId,
      registrationNumber: details.registrationNumber,
      busName: details.busName,
      busType: details.busType,
      seatingCapacity: details.seatingCapacity,
      standingCapacity: details.standingCapacity,
      manufacturer: details.manufacturer,
      manufactureYear: details.manufactureYear,
      fitnessExpiry: details.fitnessExpiry,
      insuranceDetails: details.insuranceDetails,
      pollutionExpiry: details.pollutionExpiry,
      permitDetails: details.permitDetails,
      lastMaintenance: details.lastMaintenance,
      nextMaintenance: details.nextMaintenance,
    },
    driverData: driverWithPhoto,   // 👈 updated driver object
     routeData: routeData, 
  });
});


// 3️⃣ Dynamic: Entry Logs
app.get("/api/buses/:id/entrylogs", (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ error: "month and year are required" });
  }
  const data = generateEntryLogData(Number(month), Number(year));
  res.json(data);
});

// 4️⃣ Dynamic: Arrival Timeline
app.get("/api/buses/:id/arrivaltimeline", (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ error: "month and year are required" });
  }
  const data = generateArrivalTimeline(Number(month), Number(year));
  res.json(data);
});

// 5️⃣ Dynamic: Punctuality Pie Chart
app.get("/api/buses/:id/pie", (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ error: "month and year are required" });
  }
  const data = generatePieData(Number(month), Number(year));
  res.json(data);
});











//drivers





// Get all drivers
app.get("/api/drivers", (req, res) => {
  const file = path.join(__dirname, "mockdriver", "drivers.json");
  if (!fs.existsSync(file)) return res.status(404).json({ error: "Drivers not found" });
  
  const drivers = JSON.parse(fs.readFileSync(file, "utf-8"));
  res.json(drivers);
});




// Get details of one driver
app.get("/api/drivers/:id", (req, res) => {
  let driverId = req.params.id; // e.g., driver1

  // ensure consistent naming
  if (!driverId.startsWith("driver")) {
    driverId = "driver" + driverId;
  }

  // 🔹 Correct path (mockdriver/driverdetials/)
  const file = path.join(__dirname, "mockdriver", "driverdetials", `${driverId}.json`);

  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: "Driver not found" });
  }

  const driver = JSON.parse(fs.readFileSync(file, "utf-8"));

  // ✅ Dynamic photo assignment
  const driverWithPhoto = {
    ...driver,
    photo: `${req.protocol}://${req.get("host")}/images/drivers/${driverId}.png`
  };

  res.json(driverWithPhoto);
});



app.get("/api/attendance/:month/:year", (req, res) => {
  const month = parseInt(req.params.month, 10); // 1–12
  const year = parseInt(req.params.year, 10);

  const attendanceData = generateAttendance(month, year);
  res.json({ month, year, attendanceData });
});


// 4️⃣ Dynamic: Departure Timeline
app.get("/api/drivers/:id/departuretimeline", (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ error: "month and year are required" });
  }

  // Assuming driver ID can be used if needed
  const driverId = req.params.id;

  const data = generateDepartureTimeline(Number(month), Number(year));
  res.json(data);
});


// --- Server start ---
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Mock backend running at http://localhost:${PORT}`));














