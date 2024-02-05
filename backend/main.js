import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import { asyncSql, getLatest, getPage } from "./helper.js";

const app = express();
const port = 3000;

// Create SQLite database and table
const db = new sqlite3.Database("sensors.db");
db.run(
  "CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, name TEXT, value REAL, timestamp INTEGER)"
);

// Middleware to enable CORS
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// POST endpoint to add sensor entry
app.post("/", async (req, res) => {
  const body = req.body;
  if (!body.timestamp) {
    body.timestamp = Math.floor(Date.now() / 1000);
  }
  const promises = [];
  ["temp", "humidity", "light", "co2", "pressure"].forEach((name) => {
    if (!body[name]) {
      return;
    }
    promises.push(
      asyncSql(
        db,
        "INSERT INTO sensor_entries (name, value, timestamp) VALUES (?, ?, ?)",
        [name, body[name], body.timestamp]
      )
    );
  });

  const dbRes = await Promise.all(promises);
  for (let i = 0; i < dbRes.length; i++) {
    const err = dbRes[i].value[0];
    if (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json({
    error: "Data inserted!",
  });

});

// GET endpoint to get latest value of all names
app.get("/:name?", async (req, res) => {
  const { name } = req.params;
  const { last, count } = req.query;

  const data = await Promise.all([getLatest(db), getPage(db, name, last)]);
  res.json({
    latest: data[0],
    pageData: data[1],
    count,
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
