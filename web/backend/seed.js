import sqlite3 from "sqlite3";
const { Database } = sqlite3.verbose();

const db = new Database("sensors.db");
db.run(
  "CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, value TEXT, timestamp INTEGER)"
);

const seederCfg = {
  temp: {
    min: 15,
    max: 44,
    last: 15,
  },
  bp: {
    min: 60,
    max: 150,
    last: 80,
  },
  spo2: {
    min: 200,
    max: 1000,
    last: 200,
  },
};

function seedData() {
  const names = ["temp", "bp", "spo2"];
  const data = {};
  const timestamp = Math.floor(Date.now() / 1000);
  names.forEach((name) => {
    const c = seederCfg[name];
    const value = c.min + (c.max - c.min) * Math.random();
    data[name] = value;
  });

  db.run(
    "INSERT INTO sensor_entries (value, timestamp) VALUES (?, ?)",
    [JSON.stringify(data), timestamp],
    function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Seed ${this.lastID}`);
      }
    }
  );
}

setInterval(seedData, 2000);
