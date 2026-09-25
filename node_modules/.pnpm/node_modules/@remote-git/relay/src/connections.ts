import type WebSocket from "ws";

type DeviceConnection = {
  socket: WebSocket;
  pairingToken: string;
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

export function removeConnection(deviceId: string) {
  connections.delete(deviceId);

  console.log(`❌ Removed connection: ${deviceId}`);
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