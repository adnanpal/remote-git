import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { connectToRelay } from "./services/relay";
import type { MachineInfoMessage } from "@remote-git/protocol";

type PairingInfo = {
  version: number;
  deviceId: string;
  pairingToken: string;
  relay: string;
};

function App() {
  const [status, setStatus] = useState("Not connected");

  const [machine, setMachine] =
    useState<MachineInfoMessage["machine"] | null>(null);

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    console.log("📷 Starting QR scanner...");
    setError("");

    try {
      setScanning(true);

      const cameras = await Html5Qrcode.getCameras();

      console.log("📷 Cameras found:", cameras);

      if (!cameras || cameras.length === 0) {
        throw new Error("No camera found");
      }

      const camera =
        cameras.find((camera) =>
          camera.label.toLowerCase().includes("back")
        ) ??
        cameras.find((camera) =>
          camera.label.toLowerCase().includes("environment")
        ) ??
        cameras[0];

      console.log("📷 Using camera:", camera);

      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      await scanner.start(
        camera.id,
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          console.log("✅ QR detected:", decodedText);

          try {
            const pairingInfo: PairingInfo =
              JSON.parse(decodedText);

            if (
              pairingInfo.version !== 1 ||
              !pairingInfo.deviceId ||
              !pairingInfo.pairingToken ||
              !pairingInfo.relay
            ) {
              throw new Error("Invalid Remote Git QR code");
            }

            console.log("🔗 Pairing info:", pairingInfo);

            await scanner.stop();
            scanner.clear();

            scannerRef.current = null;
            setScanning(false);

            setStatus("Connecting to laptop...");

            connectToRelay(pairingInfo, {
              onSuccess: () => {
                console.log("🎉 Pairing successful!");

                setStatus("Connected to laptop");
              },

              onMachineInfo: (message) => {
                console.log(
                  "💻 Machine information received:",
                  message
                );

                setMachine(message.machine);
                setStatus("Laptop connected");
              },

              onError: (message) => {
                console.error(
                  "❌ Pairing failed:",
                  message.reason
                );

                setStatus(
                  `Pairing failed: ${message.reason}`
                );
              },
            });
          } catch (error) {
            console.error("Invalid QR:", error);

            setError("Invalid Remote Git QR code.");
          }
        },
        () => {
          // Ignore normal QR decoding failures.
        }
      );

      console.log("🎥 Scanner started successfully");
    } catch (error) {
      console.error("❌ Scanner error:", error);

      setScanning(false);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Could not start the camera.");
      }
    }
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner) {
        scanner
          .stop()
          .catch(() => {});
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Header */}

        <div className="mb-8">
          <p className="text-sm text-zinc-400 mb-2">
            Remote Git
          </p>

          <h1 className="text-3xl font-semibold">
            Connect your laptop
          </h1>

          <p className="text-zinc-400 mt-3">
            Scan the QR code displayed by the
            Remote Git agent on your laptop.
          </p>
        </div>

        {/* Scanner */}

        {!scanning && !machine && (
          <button
            onClick={startScanner}
            className="
              w-full
              rounded-xl
              bg-white
              text-black
              py-4
              font-medium
              hover:bg-zinc-200
              transition
            "
          >
            📷 Scan QR Code
          </button>
        )}

        {scanning && (
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <div id="qr-reader" />
          </div>
        )}

        {/* Error */}

        {error && (
          <p className="text-red-400 text-sm mt-4">
            {error}
          </p>
        )}

        {/* Connection Status */}

        {status !== "Not connected" && (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">
              Status
            </p>

            <p className="mt-1 font-medium">
              {status}
            </p>
          </div>
        )}

        {/* Laptop Information */}

        {machine && (
          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-lg font-semibold">
              💻 Your Laptop
            </h2>

            <div className="mt-4 space-y-3 text-sm">

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  Hostname
                </span>

                <span>
                  {machine.hostname}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  Platform
                </span>

                <span>
                  {machine.platform}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  Architecture
                </span>

                <span>
                  {machine.architecture}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  CPU
                </span>

                <span className="text-right max-w-[220px]">
                  {machine.cpu}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  CPU Cores
                </span>

                <span>
                  {machine.cpuCores}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">
                  Memory
                </span>

                <span>
                  {machine.totalMemory} GB
                </span>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default App;