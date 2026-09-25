import type {
  MachineInfoMessage,
  PairFailedMessage,
  PairSuccessMessage,
} from "@remote-git/protocol";

type PairingInfo = {
  version: number;
  deviceId: string;
  pairingToken: string;
  relay: string;
};

type RelayCallbacks = {
  onSuccess: (message: PairSuccessMessage) => void;
  onMachineInfo: (message: MachineInfoMessage) => void;
  onError: (message: PairFailedMessage) => void;
};

export function connectToRelay(
  pairingInfo: PairingInfo,
  callbacks: RelayCallbacks
) {
  console.log("☁️ Connecting to relay:", pairingInfo.relay);

  const socket = new WebSocket(pairingInfo.relay);

  socket.onopen = () => {
    console.log("✅ Connected to relay");

    const message = {
      type: "phone.pair" as const,
      deviceId: pairingInfo.deviceId,
      pairingToken: pairingInfo.pairingToken,
    };

    console.log("📤 Sending pairing request");

    socket.send(JSON.stringify(message));
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      console.log("📥 Relay:", message);

      switch (message.type) {
        case "pair.success":
          callbacks.onSuccess(message);
          break;

        case "pair.failed":
          callbacks.onError(message);
          break;

        case "machine.info":
          callbacks.onMachineInfo(message);
          break;

        default:
          console.log("ℹ️ Unknown message:", message);
      }
    } catch (error) {
      console.error("❌ Invalid relay message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("⚠️ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("❌ Relay connection closed");
  };

  return socket;
}