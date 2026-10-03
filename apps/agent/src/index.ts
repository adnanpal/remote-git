#!/usr/bin/env node
import { getMachineInfo } from "./machine/machine-info.js";
import { getOrCreateDeviceId } from "./core/config.js";
import { connectToRelay } from "./transport/websocket.js";
import { getOrCreatePairingToken } from "./pairing/token.js";
import type { PairingInfo } from "@remote-git/protocol";
import { generatePairingQR } from "./pairing/qr.js";
import fs from "node:fs/promises";
import { addWorkspace,loadWorkspaceConfig } from "./workspace/config.js";
import path from "node:path";
import os from "node:os";
import { runPairCommand,runWorkspaceCommand } from "./cli.js";

const args = process.argv.slice(2);


if (args[0] === "pair") {
    await runPairCommand(args.includes("--open"));
    process.exit(0);
}

if (args[0] === "workspace") {
    await runWorkspaceCommand(args[1], args[2]);
    process.exit(0);
}

console.log(" Remote Git Agent Starting..\n");

console.log("🚀 Remote Git Agent starting...\n");

const machine = getMachineInfo();
const deviceId = await getOrCreateDeviceId();
const pairingToken = await getOrCreatePairingToken();

const pairingInfo: PairingInfo = {
  version: 1,
  deviceId,
  pairingToken,
  relay: process.env.REMOTE_GIT_RELAY_URL ??
        "wss://remote-git-relay.onrender.com",
};

const config = await loadWorkspaceConfig();

if (config.workspaces.length === 0) {
    console.log("📂 No workspaces configured.");
    console.log(
        '   Add one with: remote-git workspace add "C:\\Projects\\MyApp"\n'
    );
} else {
    console.log("📂 Configured workspaces:");
    for (const workspace of config.workspaces) {
        console.log(`   ${workspace}`);
    }
}

const qr = await generatePairingQR(pairingInfo);


const remoteGitDir = path.join(os.homedir(), ".remote-git");

await fs.mkdir(remoteGitDir, { recursive: true });

const pairingPath = path.join(remoteGitDir, "pairing.png");

await fs.writeFile(pairingPath, qr);

console.log(`📱 Pairing QR saved to ${pairingPath}`);

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