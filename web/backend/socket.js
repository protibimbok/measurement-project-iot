import { WebSocketServer } from "ws";
import { asyncSql } from "./db.js";

const webClients = [];

let lastTimestamp = 0;
let isRecording = false;
let deviceClient = null;

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        if (data.web) {
          switch (data.action) {
            case "start":
              if (isRecording || !deviceClient) {
                return;
              }

              deviceClient.send("start");

              webClients.forEach((client) =>
                client.send(
                  JSON.stringify({
                    action: "start",
                  })
                )
              );

              isRecording = true;

              break;
            case "stop":
              if (!isRecording || !deviceClient) {
                return;
              }

              deviceClient.send("stop");
              webClients.forEach((client) =>
                client.send(
                  JSON.stringify({
                    action: "stop",
                  })
                )
              );
              isRecording = false;
              break;

            case "connect":
              webClients.push(ws);
              ws.send(
                JSON.stringify({
                  action: "connect",
                  isRecording,
                })
              );
              break;
            default:
              break;
          }
          return;
        } else if (data.action === "connect") {
          deviceClient = ws;
          if (isRecording) {
            deviceClient.send("start");
          }
          console.log("Device connected");
        } else if (!isRecording) {
          return;
        }

        if (!lastTimestamp) {
          lastTimestamp = Date.now();
        } else {
          lastTimestamp += parseInt(data.interval);
        }
        const data2 = JSON.stringify({
          value: data,
          timestamp: lastTimestamp,
        });
        data.timestamp = lastTimestamp;
        webClients.forEach((client) => client.send(data2));
        asyncSql(
          "INSERT INTO sensor_entries (value, timestamp) VALUES (?, ?)",
          [JSON.stringify(data), lastTimestamp]
        ).then(([err]) => {
          if (err) {
            console.error(err);
          }
        });
      } catch (error) {
        console.error(error);
      }
    });

    ws.on("close", () => {
      const idx = webClients.indexOf(ws);
      if (idx < 0) {
        console.log("Device disconnected");
        lastTimestamp = 0;
        if (deviceClient === ws) {
          deviceClient = null;
        }
        return;
      }
      console.log("Client disconnected");
      webClients.splice(idx, 1);
    });
  });
};
