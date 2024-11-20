export interface SocketData {
  timestamp: number;
  value: {
    accelarationX: number;
    accelarationY: number;
    accelarationZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    temperature: number;
    gasValue: number;
    interval: number;
  };
}

const DATA_RECIEVE_CALLBACKS: Array<(data: SocketData) => void> = [];

function createWebSocket() {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    ws.send(JSON.stringify({ web: true }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      for (const key in data.value) {
        data.value[key] = parseFloat(data.value[key]);
      }
      DATA_RECIEVE_CALLBACKS.forEach((callback) => callback(data));
    } catch (error) {
      console.error(error);
    }
  };

  ws.onclose = () => {
    console.log(
      "Disconnected from WebSocket server. Reconnecting in 3 seconds..."
    );
    // setTimeout(() => createWebSocket(), 3000);
  };

  ws.onerror = () => {
    ws.close();
  };

  return ws;
}

createWebSocket();

export const addMessageListener = (callback: (data: SocketData) => void) => {
  DATA_RECIEVE_CALLBACKS.push(callback);
};

export const removeMessageListener = (callback: (data: SocketData) => void) => {
  DATA_RECIEVE_CALLBACKS.splice(DATA_RECIEVE_CALLBACKS.indexOf(callback), 1);
};
