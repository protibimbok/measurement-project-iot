import sqlite3 from "sqlite3";

const db = new sqlite3.Database("sensors.db");
db.run(
  "CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, value TEXT, timestamp INTEGER)"
);

export default db;
