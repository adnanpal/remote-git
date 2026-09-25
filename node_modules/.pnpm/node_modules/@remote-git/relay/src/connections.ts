import type WebSocket from "ws";

const connections = new Map<string, WebSocket>();

export function registerConnection(
  deviceId: string,
  socket: WebSocket
) {
  connections.set(deviceId, socket);

  console.log(`🔗 Registered connection: ${deviceId}`);
}

export function getConnection(deviceId: string) {
  return connections.get(deviceId);
}

export function removeConnection(deviceId: string) {
  connections.delete(deviceId);

  console.log(`❌ Removed connection: ${deviceId}`);
}