import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { connectToRelay } from "./services/relay";
import type { MachineInfoMessage, GitRepository, Workspace, GitStatusResponseMessage, GitCommit, GitDiffResponseMessage, GitPushResponseMessage, GitCommitResponseMessage } from "@remote-git/protocol";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";

import LandingPage from "./components/LandingPage";
import QRScanner from "./components/QRScanner";
import ConnectionStatus from "./components/ConnectionStatus";
import WorkspaceList from "./components/Workspacelist";
import RepositoryList from "./components/Repositorylist";
import RepositoryDashboard from "./components/Repositorydashboard";
import Navbar from "./components/Navbar";
import BackgroundDecor from "./components/Backgounddecor";
import DeviceDashboard, { type RegisteredDevice } from "./components/DeviceDashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

type PairingInfo = {
  version: number;
  deviceId: string;
  pairingToken: string;
  relay: string;
};

type AuthMode = "login" | "signup" | null;

const localDevicesKey = (userId: string) => `remote-git:devices:${userId}`;
const pairingTokenKey = (userId: string, deviceId: string) =>
  `remote-git:pairing:${userId}:${deviceId}`;

function readLocalDevices(userId: string): RegisteredDevice[] {
  try {
    const saved = localStorage.getItem(localDevicesKey(userId));
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed as RegisteredDevice[] : [];
  } catch {
    return [];
  }
}

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
  const relayConnectionsRef = useRef(new Map<string, ReturnType<typeof connectToRelay>>());
  const retryTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const activeDeviceIdRef = useRef<string | undefined>(undefined);
  const [status, setStatus] = useState("Not connected");

  const [machine, setMachine] =
    useState<MachineInfoMessage["machine"] | null>(null);
  const [machinesByDevice, setMachinesByDevice] = useState<Record<string, MachineInfoMessage["machine"]>>({});

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Supabase auth — gates the "Connect your repository" button. Scanning
  // never starts until a session exists.
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicesError, setDevicesError] = useState("");
  const [connectedDeviceId, setConnectedDeviceId] = useState<string>();
  const [onlineDeviceIds, setOnlineDeviceIds] = useState<Set<string>>(new Set());
  const [openedDeviceId, setOpenedDeviceId] = useState<string>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) {
          relayConnectionsRef.current.forEach((connection) => connection.socket.close());
          relayConnectionsRef.current.clear();
          retryTimersRef.current.forEach((timer) => clearTimeout(timer));
          retryTimersRef.current.clear();
          setOnlineDeviceIds(new Set());
          setConnectedDeviceId(undefined);
          setOpenedDeviceId(undefined);
          activeDeviceIdRef.current = undefined;
          setMachine(null);
          setMachinesByDevice({});
          setDevices([]);
          setDevicesLoading(false);
          setDevicesError("");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!session?.user.id) return;

    Promise.resolve().then(() => {
      if (cancelled) return;
      setDevicesLoading(true);
      setDevicesError("");

      return supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (cancelled) return;

          if (error) {
            setDevicesError(`Could not sync devices: ${error.message}`);
            setDevices(readLocalDevices(session.user.id));
          } else {
            const remoteDevices = (data ?? []) as RegisteredDevice[];
            const remoteIds = new Set(remoteDevices.map((device) => device.device_id));
            const cachedDevices = readLocalDevices(session.user.id);
            setDevices([
              ...remoteDevices,
              ...cachedDevices.filter((device) => !remoteIds.has(device.device_id)),
            ]);
            setDevicesError("");
          }

          setDevicesLoading(false);
        }, () => {
          if (cancelled) return;
          setDevicesError("Could not sync devices with your account.");
          setDevices(readLocalDevices(session.user.id));
          setDevicesLoading(false);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  useEffect(() => {
    if (!session?.user.id) return;
    localStorage.setItem(localDevicesKey(session.user.id), JSON.stringify(devices));
  }, [devices, session?.user.id]);

  const connectDevice = (pairingInfo: PairingInfo) => {
    const existing = relayConnectionsRef.current.get(pairingInfo.deviceId);
    if (existing && existing.socket.readyState < WebSocket.CLOSING) return existing;

    const connection = connectToRelay(pairingInfo, {
      onSuccess: async (message) => {
        const userId = session?.user.id;
        if (!userId) return;

        localStorage.setItem(
          pairingTokenKey(userId, message.deviceId),
          pairingInfo.pairingToken
        );
        setOnlineDeviceIds((current) => new Set(current).add(message.deviceId));
        setDevices((current) => current.some((device) => device.device_id === message.deviceId)
          ? current
          : [{
            device_id: message.deviceId,
            name: null,
            relay_url: pairingInfo.relay,
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString(),
          }, ...current]);

        if (activeDeviceIdRef.current === message.deviceId) {
          setStatus("Connected to laptop");
        }
      },
      onMachineInfo: (message) => {
        const deviceId = pairingInfo.deviceId;
        const deviceName = message.machine.hostname;
        const lastSeen = new Date().toISOString();
        setOnlineDeviceIds((current) => new Set(current).add(deviceId));
        setMachinesByDevice((current) => ({ ...current, [deviceId]: message.machine }));
        setDevices((current) => {
          const knownDevice = current.some((device) => device.device_id === deviceId);
          if (!knownDevice) {
            return [{
              device_id: deviceId,
              name: deviceName,
              relay_url: pairingInfo.relay,
              last_seen: lastSeen,
              created_at: lastSeen,
            }, ...current];
          }
          return current.map((device) => device.device_id === deviceId
            ? { ...device, name: deviceName, last_seen: lastSeen }
            : device);
        });

        if (session?.user.id) {
          void supabase.from("devices").upsert({
            user_id: session.user.id,
            device_id: deviceId,
            name: deviceName,
            relay_url: pairingInfo.relay,
            last_seen: lastSeen,
          }, { onConflict: "user_id,device_id" }).then(({ error: saveError }) => {
            if (saveError) {
              console.error("Failed to save device details:", saveError);
              setDevicesError(`Could not save device details: ${saveError.message}`);
            }
          });
        }

        if (activeDeviceIdRef.current === deviceId) {
          setMachine(message.machine);
          setConnectedDeviceId(deviceId);
          setStatus("Laptop connected");
          connection.requestRepositories();
          connection.requestWorkspaces();
        }
      },
      onRepositories: (message) => {
        if (activeDeviceIdRef.current === pairingInfo.deviceId) {
          setRepositories(message.repositories);
        }
      },
      onWorkspaces: (message) => {
        if (activeDeviceIdRef.current === pairingInfo.deviceId) {
          setWorkspaces(message.workspaces);
        }
      },
      onGitStatus: (message) => {
        if (activeDeviceIdRef.current === pairingInfo.deviceId) setGitStatus(message);
      },
      onGitLog: (message) => {
        if (activeDeviceIdRef.current !== pairingInfo.deviceId) return;
        setGitLog(message.error ? [] : message.commits);
      },
      onGitDiff: (message) => {
        if (activeDeviceIdRef.current === pairingInfo.deviceId) setGitDiff(message);
      },
      onGitPush: (message) => {
        if (activeDeviceIdRef.current !== pairingInfo.deviceId) return;
        setGitPush(message);
        setIsPushing(false);
        if (message.success) connection.requestGitStatus(message.repositoryPath);
      },
      onGitCommit: (message) => {
        if (activeDeviceIdRef.current !== pairingInfo.deviceId) return;
        setGitCommit(message);
        setIsCommitting(false);
        if (message.success) {
          connection.requestGitStatus(message.repositoryPath);
          connection.requestGitLog(message.repositoryPath, 20);
        }
      },
      onError: (message) => {
        setOnlineDeviceIds((current) => {
          const next = new Set(current);
          next.delete(pairingInfo.deviceId);
          return next;
        });
        relayConnectionsRef.current.delete(pairingInfo.deviceId);

        if (message.reason === "Device is offline") {
          if (activeDeviceIdRef.current === pairingInfo.deviceId) {
            setStatus("Device is offline. Waiting for the agent...");
          }
          const previousTimer = retryTimersRef.current.get(pairingInfo.deviceId);
          if (previousTimer) clearTimeout(previousTimer);
          retryTimersRef.current.set(pairingInfo.deviceId, setTimeout(() => {
            retryTimersRef.current.delete(pairingInfo.deviceId);
            if (session?.user.id) connectDevice(pairingInfo);
          }, 5000));
        } else {
          localStorage.removeItem(pairingTokenKey(session?.user.id ?? "", pairingInfo.deviceId));
          setDevicesError("The agent was restarted. Scan its new QR code to pair again.");
        }
      },
      onDeviceStatus: (online) => {
        setOnlineDeviceIds((current) => {
          const next = new Set(current);
          if (online) next.add(pairingInfo.deviceId);
          else next.delete(pairingInfo.deviceId);
          return next;
        });
        if (!online && activeDeviceIdRef.current === pairingInfo.deviceId) {
          setMachine(null);
          setConnectedDeviceId(undefined);
          setRepositories([]);
          setWorkspaces([]);
          setStatus("Device is offline");
        }
      },
      onNeedsPairing: () => {
        localStorage.removeItem(pairingTokenKey(session?.user.id ?? "", pairingInfo.deviceId));
        relayConnectionsRef.current.delete(pairingInfo.deviceId);
        setOnlineDeviceIds((current) => {
          const next = new Set(current);
          next.delete(pairingInfo.deviceId);
          return next;
        });
        setDevicesError("The agent was restarted. Scan its new QR code to pair again.");
      },
      onDisconnect: () => {
        relayConnectionsRef.current.delete(pairingInfo.deviceId);
        setOnlineDeviceIds((current) => {
          const next = new Set(current);
          next.delete(pairingInfo.deviceId);
          return next;
        });
        if (activeDeviceIdRef.current === pairingInfo.deviceId) {
          setMachine(null);
          setConnectedDeviceId(undefined);
          setRepositories([]);
          setWorkspaces([]);
          setStatus("Not connected");
        }
      },
    });

    relayConnectionsRef.current.set(pairingInfo.deviceId, connection);
    return connection;
  };

  const connectDeviceRef = useRef(connectDevice);
  useEffect(() => {
    connectDeviceRef.current = connectDevice;
  });

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId || devicesLoading) return;

    for (const device of devices) {
      const pairingToken = localStorage.getItem(pairingTokenKey(userId, device.device_id));
      if (!pairingToken) continue;
      connectDeviceRef.current({
        version: 1,
        deviceId: device.device_id,
        pairingToken,
        relay: device.relay_url,
      });
    }
  }, [devices, devicesLoading, session?.user.id]);

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

            const deviceAlreadyOnline = session?.user.id
              && devices.some((device) => device.device_id === pairingInfo.deviceId)
              && onlineDeviceIds.has(pairingInfo.deviceId);

            if (deviceAlreadyOnline) {
              await scanner.stop();
              scanner.clear();
              scannerRef.current = null;
              setScanning(false);
              setDevicesError("This device is already in your dashboard.");
              return;
            }

            await scanner.stop();
            scanner.clear();

            scannerRef.current = null;
            setScanning(false);

            setStatus("Connecting to laptop...");

            connectDevice(pairingInfo);
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

  // Entry point for the landing page's CTA. Requires a Supabase session —
  // if there isn't one yet, show the login screen instead of the scanner.
  // The scanner only ever starts from here or from Login's onSuccess.
  const handleConnectClick = () => {
    if (session) {
      startScanner();
    } else {
      setAuthMode("login");
    }
  };

  const handleLogout = async () => {
    await cancelScanning();
    relayConnectionsRef.current.forEach((connection) => connection.socket.close());
    relayConnectionsRef.current.clear();
    relayRef.current = null;

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setDevicesError("Could not sign out. Please try again.");
      return;
    }

    setMachine(null);
  setMachinesByDevice({});
    setConnectedDeviceId(undefined);
  activeDeviceIdRef.current = undefined;
    setOpenedDeviceId(undefined);
    setWorkspaces([]);
    setRepositories([]);
    setSelectedRepository(null);
    setStatus("Not connected");
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

  const handleSelectDevice = (device: RegisteredDevice) => {
    const connection = relayConnectionsRef.current.get(device.device_id);
    if (!onlineDeviceIds.has(device.device_id) || !connection) {
      const pairingToken = session?.user.id
        ? localStorage.getItem(pairingTokenKey(session.user.id, device.device_id))
        : null;
      if (pairingToken) {
        activeDeviceIdRef.current = device.device_id;
        setOpenedDeviceId(device.device_id);
        setStatus(`Connecting to ${device.name || "device"}...`);
        connectDevice({
          version: 1,
          deviceId: device.device_id,
          pairingToken,
          relay: device.relay_url,
        });
        setDevicesError("");
        return;
      }

      setDevicesError(`${device.name || "This device"} is offline. Scan its QR code to pair again.`);
      return;
    }

    activeDeviceIdRef.current = device.device_id;
    relayRef.current = connection;
    setMachine(machinesByDevice[device.device_id] ?? null);
    setConnectedDeviceId(device.device_id);
    setDevicesError("");
    setOpenedDeviceId(device.device_id);
    connection.requestRepositories();
    connection.requestWorkspaces();
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
      {screen !== "landing" && !authMode && !session && (
        <Navbar connected={!!machine} hostname={machine?.hostname} />
      )}

      <main className="relative">
        {authMode === "login" && (
          <Login
            onSuccess={() => {
              setAuthMode(null);
            }}
            onSwitchToSignup={() => setAuthMode("signup")}
          />
        )}

        {authMode === "signup" && (
          <Signup onSwitchToLogin={() => setAuthMode("login")} />
        )}

        {!authMode && !session && screen === "landing" && (
          <LandingPage onScan={handleConnectClick} error={error} />
        )}

        {!authMode && session && !scanning && !selectedRepository &&
          !(openedDeviceId && onlineDeviceIds.has(openedDeviceId) && machine) && (
          <DeviceDashboard
            user={session.user}
            devices={devices}
            loading={devicesLoading}
            error={devicesError}
            onlineDeviceIds={onlineDeviceIds}
            onScan={startScanner}
            onLogout={handleLogout}
            onSelectDevice={handleSelectDevice}
          />
        )}

        {!authMode && screen === "scanning" && (
          <QRScanner onCancel={cancelScanning} error={error} />
        )}

        {!authMode && screen === "connecting" && (
          <div className="w-full max-w-md mx-auto px-5 pt-6 pb-14 animate-fade-in-up">
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

        {!authMode && screen === "connected" && machine && openedDeviceId === connectedDeviceId && (
          <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl mx-auto px-5 sm:px-8 pt-6 pb-14 space-y-6">
            <button
              type="button"
              onClick={() => {
                activeDeviceIdRef.current = undefined;
                setOpenedDeviceId(undefined);
                setConnectedDeviceId(undefined);
                setMachine(null);
                setRepositories([]);
                setWorkspaces([]);
              }}
              className="text-sm text-[#8b95a1] transition-colors hover:text-[#eef1f4]"
            >
              Back to devices
            </button>
            <ConnectionStatus machine={machine} status={status} />
            <WorkspaceList workspaces={workspaces} />
            <RepositoryList
              repositories={repositories}
              onSelect={handleSelectRepository}
            />
          </div>
        )}

        {!authMode && screen === "repository" && selectedRepository && (
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