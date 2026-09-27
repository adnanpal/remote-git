import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { connectToRelay } from "./services/relay";
import type { MachineInfoMessage, GitRepository, Workspace, GitStatusResponseMessage, GitCommit, GitDiffResponseMessage, GitPushResponseMessage, GitCommitResponseMessage } from "@remote-git/protocol";

import LandingPage from "./components/LandingPage";
import QRScanner from "./components/QRScanner";
import ConnectionStatus from "./components/ConnectionStatus";
import WorkspaceList from "./components/Workspacelist";
import RepositoryList from "./components/Repositorylist";
import RepositoryDashboard from "./components/Repositorydashboard";
import Navbar from "./components/Navbar";
import BackgroundDecor from "./components/Backgounddecor";

type PairingInfo = {
  version: number;
  deviceId: string;
  pairingToken: string;
  relay: string;
};

function App() {

  const [gitCommit, setGitCommit] =
    useState<GitCommitResponseMessage | null>(null);

  const [isCommitting, setIsCommitting] =
    useState(false);

  const [gitPush, setGitPush] =
    useState<GitPushResponseMessage | null>(null);

  const [isPushing, setIsPushing] = useState(false);

  const [selectedRepository, setSelectedRepository] =
    useState<GitRepository | null>(null);

  const [gitLog, setGitLog] = useState<GitCommit[]>([]);
  const [gitDiff, setGitDiff] =
    useState<GitDiffResponseMessage | null>(null);

  const [gitStatus, setGitStatus] =
    useState<GitStatusResponseMessage | null>(null);

  const [workspaces, setWorkspaces] =
    useState<Workspace[]>([]);

  const [repositories, setRepositories] = useState<GitRepository[]>([]);
  const relayRef = useRef<ReturnType<typeof connectToRelay> | null>(
    null
  );
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
        { facingMode: "environment" },
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

            relayRef.current = connectToRelay(pairingInfo, {
              onSuccess: () => {
                console.log("🎉 Pairing successful!");

                setStatus("Connected to laptop");
                relayRef.current?.requestRepositories();
                relayRef.current?.requestWorkspaces();
              },
              onGitStatus: (message) => {
                console.log("🌿 Git status received:", message);

                setGitStatus(message);
              },

              onMachineInfo: (message) => {
                console.log(
                  "💻 Machine information received:",
                  message
                );

                setMachine(message.machine);
                setStatus("Laptop connected");
              },

              onRepositories: (message) => {
                console.log(
                  "📂 Repositories received:",
                  message.repositories
                );

                setRepositories(message.repositories);
              },
              onWorkspaces: (message) => {
                console.log(
                  "📂 Workspaces received:",
                  message.workspaces
                );

                setWorkspaces(message.workspaces);
              },
              onGitLog: (message) => {
                console.log("📜 Git log received:", message);

                if (message.error) {
                  console.error("❌ Git log error:", message.error);
                  setGitLog([]);
                  return;
                }

                setGitLog(message.commits);
              },

              onGitDiff: (message) => {
                console.log("🔍 Git diff received:", message);
                setGitDiff(message);
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
              onGitPush: (message) => {
                console.log("⬆️ Git push received:", message);

                setGitPush(message);
                setIsPushing(false);

                if (message.success) {
                  // Refresh Git status after a successful push.
                  relayRef.current?.requestGitStatus(
                    message.repositoryPath
                  );
                }
              },
              onGitCommit: (message) => {
                console.log("💾 Git commit received:", message);

                setGitCommit(message);
                setIsCommitting(false);

                if (message.success) {
                  relayRef.current?.requestGitStatus(
                    message.repositoryPath
                  );

                  relayRef.current?.requestGitLog(
                    message.repositoryPath,
                    20
                  );
                }
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

  // Lets the user back out of the scanner screen. Additive only —
  // does not change the pairing/relay logic above.
  const cancelScanning = async () => {
    const scanner = scannerRef.current;

    if (scanner) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch {
        // Scanner may already be stopped; nothing else to do.
      }
    }

    scannerRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner) {
        scanner
          .stop()
          .catch(() => { });
      }
    };
  }, []);

  const handleSelectRepository = (repo: GitRepository) => {
    console.log("📁 Repository selected:", repo);

    setSelectedRepository(repo);
    setGitStatus(null);
    setGitLog([]);
    setGitDiff(null);
    setGitPush(null);
    setIsPushing(false);
    setGitCommit(null);
    setIsCommitting(false);


    relayRef.current?.requestGitStatus(repo.path);
    relayRef.current?.requestGitLog(repo.path, 20);
  };
  const handleGitCommit = (
  files: string[],
  message: string
) => {
  if (!selectedRepository || isCommitting) {
    return;
  }

  console.log(
    "💾 Starting Git commit:",
    selectedRepository.path,
    files,
    message
  );

  setGitCommit(null);
  setIsCommitting(true);

  relayRef.current?.requestGitCommit(
    selectedRepository.path,
    files,
    message
  );
};
  const handleGitPush = () => {
    if (!selectedRepository || isPushing) {
      return;
    }

    console.log(
      "⬆️ Starting Git push:",
      selectedRepository.path
    );

    setGitPush(null);
    setIsPushing(true);

    relayRef.current?.requestGitPush(
      selectedRepository.path
    );
  };
  const handleBackToRepositories = () => {
    setSelectedRepository(null);
    setGitStatus(null);
    setGitLog([]);
    setGitPush(null);
    setIsPushing(false);
    setGitDiff(null);
  };

  // Derived screen — all from existing state, no extra state needed.
  const screen = scanning
    ? "scanning"
    : !machine
      ? status === "Not connected"
        ? "landing"
        : "connecting"
      : selectedRepository
        ? "repository"
        : "connected";

  const pairingFailed = status.startsWith("Pairing failed");

  return (
    <div className="relative min-h-screen bg-[#05070a] text-[#eef1f4]">
      <BackgroundDecor />
      {screen !== "landing" && (
        <Navbar connected={!!machine} hostname={machine?.hostname} />
      )}

      <main className="relative">
        {screen === "landing" && (
          <LandingPage onScan={startScanner} error={error} />
        )}

        {screen === "scanning" && (
          <QRScanner onCancel={cancelScanning} error={error} />
        )}

        {screen === "connecting" && (
          <div className="w-full max-w-md mx-auto px-5 pt-28 pb-14 animate-fade-in-up">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
              <p className="text-xs font-medium tracking-[.14em] text-[#39e08a] uppercase mb-3 font-mono">
                Remote-Git
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${pairingFailed ? "bg-[#ff6b6b]" : "bg-[#f5b95e] animate-pulse-dot"
                    }`}
                />
                <p className="text-sm text-[#c7ccd3]">{status}</p>
              </div>

              {pairingFailed && (
                <button
                  onClick={startScanner}
                  className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm text-[#c7ccd3] transition-colors hover:bg-white/[0.06]"
                >
                  Scan again
                </button>
              )}
            </div>
          </div>
        )}

        {screen === "connected" && machine && (
          <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl mx-auto px-5 sm:px-8 pt-28 md:pt-32 pb-14 space-y-6">
            <ConnectionStatus machine={machine} status={status} />
            <WorkspaceList workspaces={workspaces} />
            <RepositoryList
              repositories={repositories}
              onSelect={handleSelectRepository}
            />
          </div>
        )}

        {screen === "repository" && selectedRepository && (
          <RepositoryDashboard
            repository={selectedRepository}
            gitStatus={gitStatus}
            gitLog={gitLog}
            gitDiff={gitDiff}
            gitPush={gitPush}
              gitCommit={gitCommit}
  isCommitting={isCommitting}
            isPushing={isPushing}
            onPush={handleGitPush}
            onCommit={handleGitCommit}
            onRequestDiff={(filePath) => {
              setGitDiff(null);

              relayRef.current?.requestGitDiff(
                selectedRepository.path,
                filePath
              );
            }}
            onBack={handleBackToRepositories}
          />
        )}
      </main>
    </div>
  );
}

export default App;