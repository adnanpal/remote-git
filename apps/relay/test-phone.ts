import WebSocket from "ws";

const deviceId = "dev_0e2def9c-e0f9-46cf-8517-0335cca343ce";
const pairingToken = "c5b0f5bcfb4a427c3a26b46abe5d9faa32640855dd08935bd692bdc6635cd11c";

const socket = new WebSocket("ws://localhost:8080");

socket.on("open", () => {
  console.log("📱 Phone connected to relay");

  socket.send(
    JSON.stringify({
      type: "phone.pair",
      deviceId,
      pairingToken,
    })
  );

  console.log("📤 Pairing request sent");
});

socket.on("message", (data) => {
  const message = JSON.parse(data.toString());

  console.log("📥 Relay:", message);

  if (message.type === "pair.success") {
    console.log("✅ Phone successfully paired!");
  }

  if (message.type === "pair.failed") {
    console.log("❌ Pairing failed:", message.reason);
  }

  if (message.type === "machine.info") {
    console.log("\n💻 Laptop Information");
    console.log("----------------------");

    console.log(`Hostname: ${message.machine.hostname}`);
    console.log(`OS: ${message.machine.platform}`);
    console.log(`Architecture: ${message.machine.architecture}`);
    console.log(`CPU: ${message.machine.cpu}`);
    console.log(`CPU Cores: ${message.machine.cpuCores}`);
    console.log(`Total RAM: ${message.machine.totalMemory} GB`);
    console.log(`Free RAM: ${message.machine.freeMemory} GB`);
  }
});

socket.on("close", () => {
  console.log("❌ Phone disconnected");
});

socket.on("error", (error) => {
  console.error("⚠️ Error:", error.message);
});