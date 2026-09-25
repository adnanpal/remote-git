import { WebSocketServer } from "ws";
import { registerConnection, removeConnection } from "./connections.js";

const PORT = 8080;

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (socket) => {
  console.log("🔗 A device connected");

  let deviceId: string | undefined;

  socket.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      console.log("📨 Received:", message);


      if (message.type === "agent.register") {

        deviceId = message.deviceId;

        registerConnection(message.deviceId,socket);

        console.log("\n💻 Laptop registered");
        console.log(`Device ID: ${message.deviceId}`);
        console.log(`Hostname: ${message.machine.hostname}`);
        console.log(`OS: ${message.machine.platform}`);
        console.log(`CPU: ${message.machine.cpu}`);
        console.log(`RAM: ${message.machine.totalMemory} GB`);

        socket.send(
          JSON.stringify({
            type: "agent.registered",
            deviceId,
          })
        );
      }
    } catch (error) {
      console.error("Invalid message received");
    }
  });

  socket.on("close", () => {
    if(deviceId){
        removeConnection(deviceId);
    }
    console.log("❌ Device disconnected");
  });
});

console.log(`☁️ Remote Git Relay`);
console.log(`WebSocket server: ws://localhost:${PORT}`);