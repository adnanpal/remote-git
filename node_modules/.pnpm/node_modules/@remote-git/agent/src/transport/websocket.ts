import WebSocket from "ws";
import type {
    AgentRegisterMessage,
    PingMessage,
    PongMessage,
} from "@remote-git/protocol";

export function connectToRelay(
    deviceId: string,
    pairingToken: string,
    machine: AgentRegisterMessage["machine"]
) {
    const socket = new WebSocket("ws://localhost:8080");

    socket.on("open", () => {
        console.log("✅ Connected to relay");

        const message: AgentRegisterMessage = {
            type: "agent.register",
            deviceId,
            pairingToken,
            machine,
        };

        console.log("📤 Registering laptop...");

        socket.send(JSON.stringify(message));
    });

    socket.on("message", (data) => {
        const message = JSON.parse(data.toString());

        console.log("📥 Relay:", message);

        if (message.type === "ping") {
            const pong: PongMessage = {
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
    });

    socket.on("close", () => {
        console.log("❌ Relay connection closed");
    });

    socket.on("error", (error) => {
        console.error("⚠️ WebSocket error:", error.message);
    });

    return socket;
}