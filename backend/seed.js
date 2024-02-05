import sqlite3 from "sqlite3";
const { Database } = sqlite3.verbose();

const db = new Database("sensors.db");
db.run(
  "CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, name TEXT, value REAL, timestamp INTEGER)"
);

function seedData() {
  const names = ["temp", "humidity", "co2", "light", "pressure"];

  names.forEach((name) => {
    const value = Math.random() * 50 + 10;
    const timestamp = Math.floor(Date.now() / 1000);

    db.run(
      "INSERT INTO sensor_entries (name, value, timestamp) VALUES (?, ?, ?)",
      [name, value, timestamp],
      function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`Seeded data for ${name} with id ${this.lastID}`);
        }
      }
    );
  });
}

setInterval(seedData, 5000);
