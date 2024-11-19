import http from "http";
import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import { asyncQuery, asyncSql, getPage } from "./helper.js";
import { createWebSocketServer } from "./socket.js";

const app = express();
const server = http.createServer(app);

createWebSocketServer(server);

const port = 3000;
const db = new sqlite3.Database("sensors.db");
db.run(
  "CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, value TEXT, timestamp INTEGER)"
);

app.use(cors());

app.use(express.json());

app.post("/", async (req, res) => {
  const body = req.body;
  const timestamp = body.timestamp || Math.floor(Date.now() / 1000);
  if (body.timestamp) {
    delete body.timestamp;
  }
  const [err] = await asyncSql(
    db,
    "INSERT INTO sensor_entries (value, timestamp) VALUES (?, ?, ?)",
    [JSON.stringify(body), timestamp]
  );
  if (err) {
    return res.status(500).json({ error: err.message });
  }
  res.json({
    message: "Data inserted!",
  });
});

app.get("/erase", async (req, res) => {
  await asyncSql(db, "DELETE FROM `sensor_entries`");
  res.json({
    message: "Data cleared successfully!",
  });
});

app.get("/refresh", async (req, res) => {
  const { last } = req.query;

  let sql = "";
  const binds = [];

  if (!last || last == "0") {
    const timestamp = Math.floor(Date.now() / 1000);
    sql = `SELECT * FROM sensor_entries WHERE ( ${timestamp} - timestamp) < 60 ORDER BY id DESC LIMIT 10`;
  } else {
    sql = "SELECT * FROM sensor_entries WHERE id > ? ORDER BY id DESC LIMIT 10";
    binds.push(last);
  }

  const [err, rows] = await asyncQuery(db, sql, binds);

  if (err) {
    return res.status(500).json({ error: err.message });
  }

  res.json({
    data: rows || [],
  });
});

app.get("/page", async (req, res) => {
  const { page, last } = req.query;
  const rows = await getPage(db, parseInt(page), parseInt(last));
  res.json({
    data: rows || [],
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
