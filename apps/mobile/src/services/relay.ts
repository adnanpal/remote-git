import type {
    MachineInfoMessage,
    PairFailedMessage,
    PairSuccessMessage,
    GitRepositoriesResponseMessage,
    WorkspaceListResponseMessage,
    GitStatusResponseMessage,
    GitLogResponseMessage,
    GitDiffResponseMessage,
} from "@remote-git/protocol";

type PairingInfo = {
    version: number;
    deviceId: string;
    pairingToken: string;
    relay: string;
};

type RelayCallbacks = {
    onSuccess: (message: PairSuccessMessage) => void;
    onWorkspaces: (
        message: WorkspaceListResponseMessage
    ) => void;

    onMachineInfo: (
        message: MachineInfoMessage
    ) => void;

    onRepositories: (
        message: GitRepositoriesResponseMessage
    ) => void;

    onError: (
        message: PairFailedMessage
    ) => void;

    onGitStatus: (message: GitStatusResponseMessage) => void;
    onGitLog: (message: GitLogResponseMessage) => void;
    onGitDiff: (message: GitDiffResponseMessage) => void;
};

export function connectToRelay(
    pairingInfo: PairingInfo,
    callbacks: RelayCallbacks
) {
    console.log(
        "☁️ Connecting to relay:",
        pairingInfo.relay
    );

    const socket = new WebSocket(
        pairingInfo.relay
    );

    socket.onopen = () => {
        console.log("✅ Connected to relay");

        const message = {
            type: "phone.pair" as const,
            deviceId: pairingInfo.deviceId,
            pairingToken: pairingInfo.pairingToken,
        };

        console.log(
            "📤 Sending pairing request"
        );

        socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(
                event.data
            );

            console.log(
                "📥 Relay:",
                message
            );

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

                case "git.repositories.response":
                    callbacks.onRepositories(message);
                    break;

                case "workspace.list.response":
                    callbacks.onWorkspaces(message);
                    break;
                case "git.status.response":
                    callbacks.onGitStatus(message);
                    break;

                case "git.log.response":
                    callbacks.onGitLog(message);
                    break;
                case "git.diff.response":
                    callbacks.onGitDiff(message);
                    break;

                default:
                    console.log(
                        "ℹ️ Unknown message:",
                        message
                    );
            }
        } catch (error) {
            console.error(
                "❌ Invalid relay message:",
                error
            );
        }
    };

    socket.onerror = (error) => {
        console.error(
            "⚠️ WebSocket error:",
            error
        );
    };

    socket.onclose = () => {
        console.log(
            "❌ Relay connection closed"
        );
    };

    return {
        socket,

        requestRepositories() {
            console.log(
                "📂 Requesting repositories..."
            );

            socket.send(
                JSON.stringify({
                    type: "git.repositories.request",
                })
            );
        },
        requestWorkspaces() {
            console.log("📂 Requesting workspaces...");

            socket.send(
                JSON.stringify({
                    type: "workspace.list.request",
                })
            );
        },
        requestGitStatus(repositoryPath: string) {

            console.log("Requesting git Status:", repositoryPath);

            socket.send(JSON.stringify({
                type: "git.status.request",
                repositoryPath,
            })
            );
        },
        requestGitLog(repositoryPath: string, limit = 20) {
            console.log("📜 Requesting Git log:", repositoryPath);

            socket.send(
                JSON.stringify({
                    type: "git.log.request",
                    repositoryPath,
                    limit,
                })
            );
        },
        requestGitDiff(repositoryPath: string, filePath?: string) {
            console.log(
                "🔍 Requesting Git diff:",
                repositoryPath,
                filePath
            );

            socket.send(
                JSON.stringify({
                    type: "git.diff.request",
                    repositoryPath,
                    filePath,
                })
            );
        },
    };
}