import { getMachineInfo } from "./machine/machine-info.js";
import { generateDeviceId } from "./core/config.js";
import { connectToRelay } from "./transport/websocket.js";
import { generatePairingToken } from "./pairing/token.js";
import type { PairingInfo } from "@remote-git/protocol";
import { generatePairingQR } from "./pairing/qr.js";
import fs from "node:fs/promises";


console.log(" Remote Git Agent Starting..\n");

console.log("🚀 Remote Git Agent starting...\n");

const machine = getMachineInfo();
const deviceId = generateDeviceId();
const pairingToken = generatePairingToken();

const pairingInfo: PairingInfo = {
  version: 1,
  deviceId,
  pairingToken,
  relay: "ws://192.168.1.61:8080",
};

const qr = await generatePairingQR(pairingInfo);

await fs.writeFile("pairing.png", qr);

console.log("📱 Pairing QR saved to pairing.png");

async function setupPairing() {
  const pairingInfo: PairingInfo = {
    version: 1,
    deviceId,
    pairingToken,
    relay: "ws://localhost:8080",
  };

  const qrDataUrl = await generatePairingQR(pairingInfo);

  console.log("\n📱 Pairing QR generated");
  console.log(qrDataUrl);
}

setupPairing();

console.log(`Pairing Token: ${pairingToken}`);

console.log("💻 Machine Information");
console.log("----------------------");
console.log(`Device Id : ${deviceId}`)
console.log(`Hostname: ${machine.hostname}`);
console.log(`OS: ${machine.platform}`);
console.log(`Architecture: ${machine.architecture}`);
console.log(`CPU: ${machine.cpu}`);
console.log(`CPU Cores: ${machine.cpuCores}`);
console.log(`Total RAM: ${machine.totalMemory} GB`);
console.log(`Free RAM: ${machine.freeMemory} GB`);

console.log("\n🌐 Connecting to relay...");

connectToRelay(deviceId,pairingToken,machine);