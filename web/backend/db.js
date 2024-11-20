import sqlite3 from "sqlite3";

const db = new sqlite3.Database("sensors.db");
db.run(
  "CREATE TABLE IF NOT EXISTS sensor_entries (id INTEGER PRIMARY KEY, value TEXT, timestamp INTEGER)"
);

export const getPage = (page, lastID) => {
  return new Promise((resolve) => {
    let query = "";
    const binds = [];
    if (lastID) {
      query =
        "SELECT * FROM sensor_entries WHERE id < ? ORDER BY id DESC LIMIT 60 OFFSET ?";
      binds.push(lastID, (page - 1) * 60);
    } else {
      query = "SELECT * FROM sensor_entries ORDER BY id DESC LIMIT 60 OFFSET ?";
      binds.push((page - 1) * 60);
    }
    db.all(query, binds, (err, rows) => {
      if (err) {
        console.log("Name:", err.message);
        resolve([]);
      } else {
        resolve(rows);
      }
    });
  });
};

export const asyncSql = (sql, binds = []) => {
  return new Promise((resolve) => {
    db.run(sql, binds, function (err, rows) {
      resolve([err, rows, this]);
    });
  });
};

export const asyncQuery = (sql, binds = []) => {
  return new Promise((resolve) => {
    db.all(sql, binds, function (err, rows) {
      resolve([err, rows]);
    });
  });
};

export default db;
