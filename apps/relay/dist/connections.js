const connections = new Map();
export function registerConnection(deviceId, socket, pairingToken) {
    connections.set(deviceId, {
        socket,
        pairingToken,
    });
    console.log(`🔗 Registered connection: ${deviceId}`);
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
export function removeConnection(deviceId) {
    connections.delete(deviceId);
    console.log(`❌ Removed connection: ${deviceId}`);
}
