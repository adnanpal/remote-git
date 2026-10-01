const connections = new Map();
export function registerConnection(deviceId, socket, pairingToken) {
    const previous = connections.get(deviceId);
    const tokenChanged = !!previous && previous.pairingToken !== pairingToken;
    connections.set(deviceId, {
        socket,
        pairingToken,
        phone: tokenChanged ? undefined : previous?.phone,
    });
    console.log(`🔗 Registered connection: ${deviceId}`);
    return { tokenChanged, previousPhone: tokenChanged ? previous?.phone : undefined };
}
export function getConnection(deviceId) {
    return connections.get(deviceId);
}
export function validatePairingToken(deviceId, pairingToken) {
    const connection = connections.get(deviceId);
    if (!connection) {
        return false;
    }
    return connection.pairingToken === pairingToken;
}
export function attachPhone(deviceId, phoneSocket) {
    const connection = connections.get(deviceId);
    if (!connection) {
        return false;
    }
    connection.phone = phoneSocket;
    return true;
}
export function getPhoneConnection(deviceId) {
    return connections.get(deviceId)?.phone;
}
export function getConnectionBySocket(socket) {
    for (const [deviceId, connection] of connections.entries()) {
        if (connection.socket === socket) {
            return {
                deviceId,
                ...connection,
            };
        }
    }
    return undefined;
}
export function getConnectionByPhoneSocket(socket) {
    for (const [deviceId, connection] of connections.entries()) {
        if (connection.phone === socket) {
            return {
                deviceId,
                ...connection,
            };
        }
    }
    return undefined;
}
export function sendToDevice(deviceId, message) {
    const connection = connections.get(deviceId);
    if (!connection?.socket) {
        console.log(`⚠️ Device offline: ${deviceId}`);
        return false;
    }
    connection.socket.send(JSON.stringify(message));
    return true;
}
export function removeConnection(deviceId, socket) {
    const connection = connections.get(deviceId);
    if (!connection) {
        return;
    }
    // Ignore a stale socket closing after a newer connection
    // has already replaced it.
    if (connection.socket !== socket) {
        console.log(`⚠️ Ignoring stale socket: ${deviceId}`);
        return;
    }
    connection.socket = undefined;
    console.log(`🔌 Device disconnected: ${deviceId}`);
}
