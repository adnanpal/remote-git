import { WebSocketServer } from "ws";
import { registerConnection, removeConnection, getConnection, validatePairingToken, attachPhone, getConnectionBySocket, getConnectionByPhoneSocket } from "./connections.js";


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

                registerConnection(message.deviceId, socket, message.pairingToken);

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
            if (message.type === "git.repositories.request") {
                const connection = getConnectionByPhoneSocket(socket);

                if (!connection) {
                    return;
                }

                connection.socket.send(
                    JSON.stringify(message)
                );

                return;
            }
            if (message.type === "workspace.list.request") {
                const connection = getConnectionByPhoneSocket(socket);

                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }

                connection.socket.send(JSON.stringify(message));

                console.log("📂 Workspace request forwarded to agent");
                return;
            }

            if (message.type === "git.repositories.response") {
                const connection = getConnectionBySocket(socket);

                if (!connection?.phone) {
                    return;
                }

                connection.phone.send(
                    JSON.stringify(message)
                );

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
                const isValid = validatePairingToken(
                    message.deviceId,
                    message.pairingToken
                );


                if (!isValid) {
                    console.log("❌ Pairing failed");

                    socket.send(
                        JSON.stringify({
                            type: "pair.failed",
                            reason: "Invalid device ID or pairing token",
                        })
                    );

                    return;
                }

                const connection = getConnection(message.deviceId);

                if (!connection) {
                    socket.send(
                        JSON.stringify({
                            type: "pair.failed",
                            reason: "Device is offline",
                        })
                    );

                    return;
                }

                const attached = attachPhone(
                    message.deviceId,
                    socket
                );

                if (!attached) {
                    socket.send(
                        JSON.stringify({
                            type: "pair.failed",
                            reason: "Could not create pairing session",
                        })
                    );

                    return;
                }

                console.log(
                    `📱 Phone paired with ${message.deviceId}`
                );

                socket.send(
                    JSON.stringify({
                        type: "pair.success",
                        deviceId: message.deviceId,
                    })
                );

                connection.socket.send(
                    JSON.stringify({
                        type: "phone.connected",
                    })
                );
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
                connection.socket.send(JSON.stringify(message));
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

                connection.socket.send(JSON.stringify(message));

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

                connection.socket.send(JSON.stringify(message));

                console.log("🔍 Git diff request forwarded to agent");
                return;
            }
            if (message.type === "git.diff.request") {
                const connection = getConnectionByPhoneSocket(socket);

                if (!connection) {
                    console.log("❌ Phone connection not found");
                    return;
                }

                connection.socket.send(JSON.stringify(message));

                console.log("🔍 Git diff request forwarded to agent");
                return;
            }
        } catch (error) {
            console.error("Invalid message received");
        }
    });

    socket.on("close", () => {
        if (deviceId) {
            removeConnection(deviceId);
        }
        console.log("❌ Device disconnected");
    });
});

console.log(`☁️ Remote Git Relay`);
console.log(`WebSocket server: ws://localhost:${PORT}`);