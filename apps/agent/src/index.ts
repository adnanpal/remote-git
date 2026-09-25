import { getMachineInfo } from "./machine/machine-info.js";
import { generateDeviceId } from "./core/config.js";
import { connectToRelay } from "./transport/websocket.js";

console.log(" Remote Git Agent Starting..\n");

console.log("🚀 Remote Git Agent starting...\n");

const machine = getMachineInfo();
const deviceId = generateDeviceId();

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

connectToRelay(deviceId,machine);