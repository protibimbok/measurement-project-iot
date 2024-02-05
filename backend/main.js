import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import { getLatest, getPage } from "./helper.js";

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
app.post("/", (req, res) => {
  const { name, value, timestamp } = req.body;
  db.run(
    "INSERT INTO sensor_entries (name, value, timestamp) VALUES (?, ?, ?)",
    [name, value, timestamp],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// GET endpoint to get latest value of all names
app.get("/:name?", async (req, res) => {
  const { name } = req.params;
  const { last, count } = req.query;

  const data = await Promise.all([getLatest(db), getPage(db, name, last)]);
  res.json({
    latest: data[0],
    pageData: data[1],
    count
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
