import { getMachineInfo } from "./machine/machine-info.js";
import { generateDeviceId } from "./core/config.js";
import { connectToRelay } from "./transport/websocket.js";
import { generatePairingToken } from "./pairing/token.js";
import type { PairingInfo } from "@remote-git/protocol";
import { generatePairingQR } from "./pairing/qr.js";
import fs from "node:fs/promises";
import { addWorkspace,loadWorkspaceConfig } from "./workspace/config.js";
import path from "node:path";



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

const config = await loadWorkspaceConfig();

if (config.workspaces.length === 0) {
  const workspace = path.resolve(process.cwd());

  await addWorkspace(workspace);

  console.log(`📂 Initial workspace: ${workspace}`);
} else {
  console.log("📂 Configured workspaces:");

  for (const workspace of config.workspaces) {
    console.log(`   ${workspace}`);
  }
}

const qr = await generatePairingQR(pairingInfo);

await fs.writeFile("pairing.png", qr);

console.log("📱 Pairing QR saved to pairing.png");

console.log(`Pairing Token: ${pairingToken}`);

console.log("💻 Machine Information");
console.log("----------------------");
console.log(`Device Id : ${deviceId}`);
console.log(`Hostname: ${machine.hostname}`);
console.log(`OS: ${machine.platform}`);
console.log(`Architecture: ${machine.architecture}`);
console.log(`CPU: ${machine.cpu}`);
console.log(`CPU Cores: ${machine.cpuCores}`);
console.log(`Total RAM: ${machine.totalMemory} GB`);
console.log(`Free RAM: ${machine.freeMemory} GB`);

console.log("\n🌐 Connecting to relay...");

connectToRelay(deviceId, pairingToken, machine);