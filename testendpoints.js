const BASE = "http://localhost:5000/api/buses";

async function test() {
  console.log("1️⃣ All buses:");
  console.log(await (await fetch(`${BASE}`)).json());

  console.log("2️⃣ Single bus:");
const singleBus = await (await fetch(`${BASE}/bus1`)).json();
console.log(JSON.stringify(singleBus, null, 2));


  console.log("3️⃣ Entry logs:");
  console.log(await (await fetch(`${BASE}/bus1/entrylogs?month=8&year=2025`)).json());

  console.log("4️⃣ Arrival timeline:");
  console.log(await (await fetch(`${BASE}/bus1/arrivaltimeline?month=8&year=2025`)).json());

  console.log("5️⃣ Pie chart:");
  console.log(await (await fetch(`${BASE}/bus1/pie?month=8&year=2025`)).json());
}

test();
