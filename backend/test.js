import sqlite3 from "sqlite3";
import { asyncQuery } from "./helper.js";
const { Database } = sqlite3.verbose();

const db = new Database("sensors.db");

asyncQuery(db, "SELECT * FROM sensor_entries").then((res) => {
  console.log(res);
});
