import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";  

import { generateEntryLogData } from "./utils/mockEntryLog.js";
import { generateArrivalTimeline } from "./utils/mockArrivalTimeline.js";
import { generatePieData } from "./utils/piebusMockData.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Path helper (safer with resolve)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockPath = (file) => path.join(__dirname, "mock", file);


// ✅ Serve static driver images
app.use("/images", express.static(path.join(__dirname, "public/images")));


// --- API Routes ---

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
  const file = path.join(__dirname, "mock", "busdetails", `${busId}.json`);
  

  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: "Bus not found" });
  }

  const details = JSON.parse(fs.readFileSync(file, "utf-8"));


  // Load external route JSON (westmambalam.json)
const routeFile = path.join(__dirname, "mock", "busroutes", `${busId}.json`);

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

// --- Server start ---
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Mock backend running at http://localhost:${PORT}`));
