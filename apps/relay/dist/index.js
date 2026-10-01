import { WebSocketServer } from "ws";
import { registerConnection, removeConnection, getConnection, validatePairingToken, attachPhone, getConnectionBySocket, getConnectionByPhoneSocket, sendToDevice } from "./connections.js";
const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({
    port: PORT,
});
wss.on("connection", (socket) => {
    console.log("🔗 A device connected");
    let deviceId;
    socket.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log("📨 Received:", message);
            if (message.type === "agent.register") {
                deviceId = message.deviceId;
                const { tokenChanged, previousPhone } = registerConnection(message.deviceId, socket, message.pairingToken);
                console.log("\n💻 Laptop registered");
                console.log(`Device ID: ${message.deviceId}`);
                console.log(`Hostname: ${message.machine.hostname}`);
                console.log(`OS: ${message.machine.platform}`);
                console.log(`CPU: ${message.machine.cpu}`);
                console.log(`RAM: ${message.machine.totalMemory} GB`);
                socket.send(JSON.stringify({
                    type: "agent.registered",
                    deviceId,
                }));
                if (tokenChanged && previousPhone?.readyState === 1) {
                    previousPhone.send(JSON.stringify({
                        type: "device.status",
                        online: true,
                        requiresPairing: true,
                    }));
                    previousPhone.close(4001, "Agent restarted; pair again");
                }
                else {
                    const phone = getConnection(message.deviceId)?.phone;
                    if (phone?.readyState === 1) {
                        phone.send(JSON.stringify({ type: "device.status", online: true }));
                        socket.send(JSON.stringify({ type: "phone.connected" }));
                    }
                }
            }
            if (message.type === "git.repositories.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    return;
                }
                sendToDevice(connection.deviceId, message);
                return;
            }
            if (message.type === "workspace.list.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }
                sendToDevice(connection.deviceId, message);
                console.log("📂 Workspace request forwarded to agent");
                return;
            }
            if (message.type === "git.repositories.response") {
                const connection = getConnectionBySocket(socket);
                if (!connection?.phone) {
                    return;
                }
                connection.phone.send(JSON.stringify(message));
                return;
            }
            if (message.type === "workspace.list.response") {
                const connection = getConnectionBySocket(socket);
                if (!connection?.phone) {
                    console.log("❌ Paired phone not found");
                    return;
                }
                connection.phone.send(JSON.stringify(message));
                console.log("📂 Workspace response forwarded to phone");
                return;
            }
            if (message.type === "phone.pair") {
                const connection = getConnection(message.deviceId);
                if (!connection?.socket) {
                    socket.send(JSON.stringify({
                        type: "pair.failed",
                        reason: "Device is offline",
                    }));
                    return;
                }
                const isValid = validatePairingToken(message.deviceId, message.pairingToken);
                if (!isValid) {
                    console.log("❌ Pairing failed");
                    socket.send(JSON.stringify({
                        type: "pair.failed",
                        reason: "Invalid device ID or pairing token",
                    }));
                    return;
                }
                const attached = attachPhone(message.deviceId, socket);
                if (!attached) {
                    socket.send(JSON.stringify({
                        type: "pair.failed",
                        reason: "Could not create pairing session",
                    }));
                    return;
                }
                console.log(`📱 Phone paired with ${message.deviceId}`);
                socket.send(JSON.stringify({
                    type: "pair.success",
                    deviceId: message.deviceId,
                }));
                const sent = sendToDevice(message.deviceId, {
                    type: "phone.connected",
                });
                if (!sent) {
                    console.log("⚠️ Laptop is currently offline");
                }
            }
            if (message.type === "machine.info") {
                if (!deviceId) {
                    return;
                }
                const phone = getConnection(deviceId)?.phone;
                if (!phone) {
                    console.log("⚠️ No paired phone");
                    return;
                }
                phone.send(JSON.stringify(message));
            }
            if (message.type === "git.status.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    console.log(" Phone Connection is not made");
                    return;
                }
                sendToDevice(connection.deviceId, message);
                console.log("🌿 Git status request forwarded to agent");
                return;
            }
            if (message.type === "git.status.response") {
                const connection = getConnectionBySocket(socket);
                if (!connection?.phone) {
                    console.log("❌ Paired phone not found");
                    return;
                }
                connection.phone.send(JSON.stringify(message));
                console.log("🌿 Git status response forwarded to phone");
                return;
            }
            if (message.type === "git.log.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }
                sendToDevice(connection.deviceId, message);
                console.log("📜 Git log request forwarded to agent");
                return;
            }
            if (message.type === "git.log.response") {
                const connection = getConnectionBySocket(socket);
                if (!connection?.phone) {
                    console.log("❌ Paired phone not found");
                    return;
                }
                connection.phone.send(JSON.stringify(message));
                console.log("📜 Git log response forwarded to phone");
                return;
            }
            if (message.type === "git.diff.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }
                sendToDevice(connection.deviceId, message);
                console.log("🔍 Git diff request forwarded to agent");
                return;
            }
            if (message.type === "git.diff.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }
                sendToDevice(connection.deviceId, message);
                console.log("🔍 Git diff request forwarded to agent");
                return;
            }
            if (message.type === "git.push.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }
                sendToDevice(connection.deviceId, message);
                console.log("⬆️ Git push request forwarded to agent");
                return;
            }
            if (message.type === "git.push.response") {
                const connection = getConnectionBySocket(socket);
                if (!connection?.phone) {
                    console.log("❌ Paired phone not found");
                    return;
                }
                connection.phone.send(JSON.stringify(message));
                console.log("⬆️ Git push response forwarded to phone");
                return;
            }
            if (message.type === "git.commit.request") {
                const connection = getConnectionByPhoneSocket(socket);
                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }
                sendToDevice(connection.deviceId, message);
                console.log("💾 Git commit request forwarded to agent");
                return;
            }
            if (message.type === "git.commit.response") {
                const connection = getConnectionBySocket(socket);
                if (!connection?.phone) {
                    console.log("❌ Paired phone not found");
                    return;
                }
                connection.phone.send(JSON.stringify(message));
                console.log("💾 Git commit response forwarded to phone");
                return;
            }
        }
        catch (error) {
            console.error("Invalid message received");
        }
    });
    socket.on("close", () => {
        if (deviceId) {
            const connection = getConnectionBySocket(socket);
            if (connection?.phone?.readyState === 1) {
                connection.phone.send(JSON.stringify({ type: "device.status", online: false }));
            }
            removeConnection(deviceId, socket);
        }
        console.log("❌ Device disconnected");
    });
});
console.log(`☁️ Remote Git Relay`);
console.log(`WebSocket server: ws://localhost:${PORT}`);
