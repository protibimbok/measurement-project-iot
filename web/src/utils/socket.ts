function createWebSocket() {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    ws.send(JSON.stringify({ web: true }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  ws.onclose = () => {
    console.log(
      "Disconnected from WebSocket server. Reconnecting in 3 seconds..."
    );
    setTimeout(() => createWebSocket(), 3000);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    ws.close();
  };

  return ws;
}

createWebSocket();
