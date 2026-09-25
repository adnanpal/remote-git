import WebSocket from "ws";
import { discoverRepositories } from "../git/repositories.js";
import { getWorkspaces } from "../workspace/config.js";
export function connectToRelay(deviceId, pairingToken, machine) {
    const socket = new WebSocket("ws://localhost:8080");
    socket.on("open", () => {
        console.log("✅ Connected to relay");
        const message = {
            type: "agent.register",
            deviceId,
            pairingToken,
            machine,
        };
        console.log("📤 Registering laptop...");
        socket.send(JSON.stringify(message));
    });
    socket.on("message", async (data) => {
        const message = JSON.parse(data.toString());
        console.log("📥 Relay:", message);
        if (message.type === "ping") {
            const pong = {
                type: "pong",
            };
            socket.send(JSON.stringify(pong));
        }
        if (message.type === "phone.connected") {
            console.log("📱 Phone connected!");
            const machineInfo = {
                type: "machine.info",
                machine,
            };
            socket.send(JSON.stringify(machineInfo));
        }
        if (message.type === "git.repositories.request") {
            console.log("📂 Repository discovery requested");
            const repositories = await discoverRepositories();
            socket.send(JSON.stringify({
                type: "git.repositories.response",
                repositories,
            }));
            console.log(`📂 Found ${repositories.length} repositories`);
        }
        if (message.type === "workspace.list.request") {
            console.log("📂 Workspace list requested");
            const workspaces = await getWorkspaces();
            socket.send(JSON.stringify({
                type: "workspace.list.response",
                workspaces,
            }));
            console.log(`📂 Sending ${workspaces.length} workspaces`);
        }
    });
    socket.on("close", () => {
        console.log("❌ Relay connection closed");
    });
    socket.on("error", (error) => {
        console.error("⚠️ WebSocket error:", error.message);
    });
    return socket;
}
