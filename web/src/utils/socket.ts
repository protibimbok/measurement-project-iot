import { emitEvent } from "./events";
let ws: WebSocket | null = null;
function createWebSocket() {
  ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    ws?.send(JSON.stringify({ web: true, action: "connect" }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      switch (data.action) {
        case "start":
          emitEvent("startRecording", null);
          break;
        case "stop":
          emitEvent("stopRecording", null);
          break;
        case "connect":
          if (data.isRecording) {
            emitEvent("startRecording", null);
          } else {
            emitEvent("stopRecording", null);
          }
          break;
        default:
          for (const key in data.value) {
            data.value[key] = parseFloat(data.value[key]);
          }
          emitEvent("sensorData", data);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  ws.onclose = () => {
    console.log(
      "Disconnected from WebSocket server. Reconnecting in 3 seconds..."
    );
    ws = null;
    // setTimeout(() => createWebSocket(), 3000);
  };

  ws.onerror = () => {
    ws?.close();
    ws = null;
  };

  return ws;
}

createWebSocket();

export const startRecording = () => {
  ws?.send(JSON.stringify({ web: true, action: "start" }));
};

export const stopRecording = () => {
  ws?.send(JSON.stringify({ web: true, action: "stop" }));
};
