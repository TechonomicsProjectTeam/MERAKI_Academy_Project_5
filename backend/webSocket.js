const WebSocket = require("ws");
const http = require("http");

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
      console.log("Received message:", message);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return wss;
};

const getWebSocketServer = () => {
  if (!wss) {
    throw new Error("WebSocket server is not initialized. Call initializeWebSocket first.");
  }
  return wss;
};

module.exports = { initializeWebSocket, getWebSocketServer };
