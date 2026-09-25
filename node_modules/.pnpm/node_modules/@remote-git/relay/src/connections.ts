import type WebSocket from "ws";

type DeviceConnection = {
  socket: WebSocket;
  pairingToken: string;
  phone?: WebSocket;
};

const connections = new Map<string, DeviceConnection>();

export function registerConnection(
  deviceId: string,
  socket: WebSocket,
  pairingToken: string
) {
  connections.set(deviceId, {
    socket,
    pairingToken,
  });

  console.log(`🔗 Registered connection: ${deviceId}`);
}

export function getConnection(deviceId: string) {
  return connections.get(deviceId);
}

export function validatePairingToken(
  deviceId: string,
  pairingToken: string
) {
  const connection = connections.get(deviceId);

  if (!connection) {
    return false;
  }

  return connection.pairingToken === pairingToken;
}

export function attachPhone(
  deviceId: string,
  phoneSocket: WebSocket
) {
  const connection = connections.get(deviceId);

  if (!connection) {
    return false;
  }

  connection.phone = phoneSocket;

  return true;
}

export function getPhoneConnection(deviceId: string) {
  return connections.get(deviceId)?.phone;
}
export function getConnectionBySocket(socket: WebSocket) {
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

export function getConnectionByPhoneSocket(socket: WebSocket) {
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
export function removeConnection(deviceId: string) {
  connections.delete(deviceId);

  console.log(`❌ Removed connection: ${deviceId}`);
}