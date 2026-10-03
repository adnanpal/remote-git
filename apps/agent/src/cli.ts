import { getOrCreatePairingToken } from "./pairing/token.js";
import { generatePairingQR } from "./pairing/qr.js";
import { getOrCreateDeviceId } from "./core/config.js";
import { getMachineInfo } from "./machine/machine-info.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import qrcode from "qrcode-terminal";
import { execFile } from "node:child_process";
import { addWorkspace, getWorkspaces, removeWorkspace,loadWorkspaceConfig } from "./workspace/config.js";


export async function runWorkspaceCommand(
    action: string | undefined,
    workspacePath: string | undefined
) {
    if (action === "add") {
        if (!workspacePath) {
            console.error(
                '❌ Please provide a workspace path.\n\nExample:\n  remote-git workspace add "C:\\Projects\\MyApp"'
            );
            process.exitCode = 1;
            return;
        }

        const resolvedPath = path.resolve(workspacePath);

        try {
            const stats = await fs.stat(resolvedPath);

            if (!stats.isDirectory()) {
                console.error(`\n❌ Workspace path is not a directory:`);
                console.error(`   ${resolvedPath}\n`);
                process.exitCode = 1;
                return;
            }
        } catch {
            console.error(`\n❌ Workspace does not exist:`);
            console.error(`   ${resolvedPath}\n`);
            process.exitCode = 1;
            return;
        }

        const config = await addWorkspace(resolvedPath);

        console.log(`\n✅ Workspace added:`);
        console.log(`   ${resolvedPath}\n`);

        console.log("📂 Configured workspaces:");

        for (const workspace of config.workspaces) {
            console.log(`   ${workspace}`);
        }

        console.log();
        return;
    }
    if (action === "remove") {
        if (!workspacePath) {
            console.error(
                '❌ Please provide a workspace path.\n\nExample:\n  remote-git workspace remove "C:\\Projects\\MyApp"'
            );
            process.exitCode = 1;
            return;
        }

        const resolvedPath = path.resolve(workspacePath);
        const currentConfig = await loadWorkspaceConfig();

        if (!currentConfig.workspaces.some(
            (workspace) => path.resolve(workspace) === resolvedPath
        )) {
            console.error(`\n❌ Workspace is not configured:`);
            console.error(`   ${resolvedPath}\n`);
            process.exitCode = 1;
            return;
        }

        const config = await removeWorkspace(resolvedPath);

        console.log(`\n✅ Workspace removed:`);
        console.log(`   ${resolvedPath}\n`);

        if (config.workspaces.length === 0) {
            console.log("📂 No workspaces configured.\n");
            return;
        }

        console.log("📂 Configured workspaces:");

        for (const workspace of config.workspaces) {
            console.log(`   ${workspace}`);
        }

        console.log();
        return;
    }

    if (action === "list") {
        const workspaces = await getWorkspaces();

        if (workspaces.length === 0) {
            console.log("\n📂 No workspaces configured.\n");
            return;
        }

        console.log("\n📂 Configured workspaces:\n");

        for (const workspace of workspaces) {
            console.log(`   ${workspace.name}`);
            console.log(`   ${workspace.path}\n`);
        }

        return;
    }

    console.log(`
Remote Git Workspace

Usage:
  remote-git workspace add "C:\\Projects\\MyApp"
  remote-git workspace list
`);
}

export async function runPairCommand(openImage = false) {
    console.log("\n🔗 Remote Git Pairing\n");

    const deviceId = await getOrCreateDeviceId();
    const pairingToken = await getOrCreatePairingToken();
    const machine = getMachineInfo();

    const pairingInfo = {
        version: 1 as const,
        deviceId,
        pairingToken,
        relay:
            process.env.REMOTE_GIT_RELAY_URL ??
            "wss://remote-git-relay.onrender.com",
    };

    const remoteGitDir = path.join(os.homedir(), ".remote-git");

    await fs.mkdir(remoteGitDir, { recursive: true });

    const pairingPath = path.join(remoteGitDir, "pairing.png");

    const qr = await generatePairingQR(pairingInfo);

    await fs.writeFile(pairingPath, qr);

    console.log(`💻 Device: ${machine.hostname}`);
    console.log(`🆔 Device ID: ${deviceId}\n`);

    console.log("📱 Scan this QR code with the Remote Git app:\n");

    // Temporary placeholder.
    // We'll replace this with an actual terminal QR renderer next.
    console.log("📱 Scan this QR code with the Remote Git app:\n");

    qrcode.generate(JSON.stringify(pairingInfo), {
        small: true,
    });

    console.log(`\n📄 QR image also saved to:`);
    console.log(`   ${pairingPath}\n`);

    if (openImage) {
        console.log("🖼️ Opening QR image...\n");

        if (process.platform === "win32") {
            execFile("explorer.exe", [pairingPath], (error) => {
                if (error) {
                    console.error("❌ Failed to open QR image:", error.message);
                } else {
                    console.log("✅ QR image opened.");
                }
            });
        } else if (process.platform === "darwin") {
            execFile("open", [pairingPath]);
        } else {
            execFile("xdg-open", [pairingPath]);
        }
    }
}