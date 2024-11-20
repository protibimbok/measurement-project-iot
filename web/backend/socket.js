import { WebSocketServer } from "ws";
import { asyncSql } from "./helper.js";
import db from "./db.js";

const webClients = [];

let lastTimestamp = 0;

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        if (data.web) {
          webClients.push(ws);
        } else {
          if (!lastTimestamp) {
            lastTimestamp = Date.now();
          } else {
            lastTimestamp += data.interval;
          }
          const data2 = JSON.stringify({
            value: data,
            timestamp: lastTimestamp,
          });
          data.timestamp = lastTimestamp;
          webClients.forEach((client) => client.send(data2));
          asyncSql(
            db,
            "INSERT INTO sensor_entries (value, timestamp) VALUES (?, ?)",
            [JSON.stringify(data), lastTimestamp]
          ).then((err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

    ws.on("close", () => {
      const idx = webClients.indexOf(ws);
      if (idx < 0) {
        console.log("Device disconnected");
        lastTimestamp = 0;
        return;
      }
      console.log("Client disconnected");
      webClients.splice(idx, 1);
    });
  });
};
