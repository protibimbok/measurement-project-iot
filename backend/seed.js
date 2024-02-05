import sqlite3 from "sqlite3";
const { Database } = sqlite3.verbose();

const db = new Database("sensors.db");
db.run(
  "CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, name TEXT, value REAL, timestamp INTEGER)"
);

const seederCfg = {
  temp: {
    min: 15,
    max: 44,
    last: 15,
  },
  humidity: {
    min: 40,
    max: 90,
    last: 40,
  },
  pressure: {
    min: 90,
    max: 120,
    last: 90,
  },
  co2: {
    min: 200,
    max: 1000,
    last: 200,
  },
  light: {
    min: 200,
    max: 3000,
    last: 200,
  },
};

function seedData() {
  const names = ["temp", "humidity", "co2", "light", "pressure"];

  names.forEach((name) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const c = seederCfg[name];
    let value = c.min + (c.max - c.min) * Math.random();

    db.run(
      "INSERT INTO sensor_entries (name, value, timestamp) VALUES (?, ?, ?)",
      [name, value, timestamp],
      function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Seed ${name}-${this.lastID}: ${value}`);
        }
      }
    );
  });
}

setInterval(seedData, 600);
