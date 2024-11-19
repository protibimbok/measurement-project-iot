import { WebSocketServer } from "ws";

const webClients = [];

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
          const data2 = JSON.stringify(data);
          webClients.forEach((client) => client.send(data2));
        }
      } catch (error) {
        console.error(error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      webClients.splice(webClients.indexOf(ws), 1);
    });
  });
};
