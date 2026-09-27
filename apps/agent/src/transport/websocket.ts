import WebSocket from "ws";
import type {
    AgentRegisterMessage,
    PingMessage,
    PongMessage,
} from "@remote-git/protocol";
import { discoverRepositories } from "../git/repositories.js";
import { getWorkspaces } from "../workspace/config.js";
import { getGitStatus } from "../git/status.js";
import { getGitLog } from "../git/log.js";
import { getGitDiff } from "../git/diff.js";
import { pushGitRepository } from "../git/push.js";
import { commitGitRepository } from "../git/commit.js";

export function connectToRelay(
    deviceId: string,
    pairingToken: string,
    machine: AgentRegisterMessage["machine"]
) {
    
    let socket: WebSocket;
    const RELAY_URL = process.env.REMOTE_GIT_RELAY_URL ?? "ws://localhost:8080";
    const connect = ()=>{
        socket = new WebSocket(RELAY_URL);

        
    

    socket.on("open", () => {
        console.log("✅ Connected to relay");

        const message: AgentRegisterMessage = {
            type: "agent.register",
            deviceId,
            pairingToken,
            machine,
        };

        console.log("📤 Registering laptop...");

        socket.send(JSON.stringify(message));
    });
    

    socket.on("message", async (data) => {
        const message = JSON.parse(data.toString());

        console.log("📥 Relay:", message);

        if (message.type === "ping") {
            const pong: PongMessage = {
                type: "pong",
            };

            socket.send(JSON.stringify(pong));
        }
        if (message.type === "phone.connected") {
            console.log("📱 Phone connected!");

            const machineInfo = {
                type: "machine.info",
                machine,
            };

            socket.send(JSON.stringify(machineInfo));
        }
        if (message.type === "git.repositories.request") {
            console.log("📂 Repository discovery requested");

            const repositories = await discoverRepositories();

            socket.send(
                JSON.stringify({
                    type: "git.repositories.response",
                    repositories,
                })
            );

            console.log(
                `📂 Found ${repositories.length} repositories`
            );
        }
        if (message.type === "workspace.list.request") {
            console.log("📂 Workspace list requested");

            const workspaces = await getWorkspaces();

            socket.send(
                JSON.stringify({
                    type: "workspace.list.response",
                    workspaces,
                })
            );

            console.log(
                `📂 Sending ${workspaces.length} workspaces`
            );
        }
        if (message.type === "git.status.request") {
            console.log("🌿 Git status requested");

            try {
                const status = await getGitStatus(message.repositoryPath);

                socket.send(
                    JSON.stringify({
                        type: "git.status.response",
                        ...status,
                    })
                );

                console.log("🌿 Git status sent");
            } catch (error) {
                console.error("❌ Git status failed:", error);

                socket.send(
                    JSON.stringify({
                        type: "git.status.response",
                        repositoryPath: message.repositoryPath,
                        branch: "unknown",
                        clean: false,
                        staged: [],
                        modified: [],
                        untracked: [],
                        ahead: 0,
                        behind: 0,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Git status failed",
                    })
                );
            }

            return;
        }
        if (message.type === "git.log.request") {
            console.log("📜 Git log requested");

            try {
                const commits = await getGitLog(
                    message.repositoryPath,
                    message.limit ?? 20
                );

                socket.send(
                    JSON.stringify({
                        type: "git.log.response",
                        repositoryPath: message.repositoryPath,
                        commits,
                    })
                );

                console.log(`📜 Sent ${commits.length} commits`);
            } catch (error) {
                socket.send(
                    JSON.stringify({
                        type: "git.log.response",
                        repositoryPath: message.repositoryPath,
                        commits: [],
                        error:
                            error instanceof Error
                                ? error.message
                                : "Git log failed",
                    })
                );
            }

            return;
        }
        if (message.type === "git.diff.request") {
            console.log("🔍 Git diff requested");

            try {
                const diff = await getGitDiff(
                    message.repositoryPath,
                    message.filePath
                );

                socket.send(
                    JSON.stringify({
                        type: "git.diff.response",
                        repositoryPath: message.repositoryPath,
                        filePath: message.filePath,
                        diff,
                    })
                );

                console.log("🔍 Git diff sent");
            } catch (error) {
                console.error("❌ Git diff failed:", error);

                socket.send(
                    JSON.stringify({
                        type: "git.diff.response",
                        repositoryPath: message.repositoryPath,
                        filePath: message.filePath,
                        diff: "",
                        error:
                            error instanceof Error
                                ? error.message
                                : "Git diff failed",
                    })
                );
            }

            return;
        }
        if (message.type === "git.push.request") {
            console.log("⬆️ Git push requested");

            try {
                const result = await pushGitRepository(
                    message.repositoryPath
                );

                socket.send(
                    JSON.stringify({
                        type: "git.push.response",
                        repositoryPath: message.repositoryPath,
                        success: true,
                        output: result.output,
                    })
                );

                console.log("⬆️ Git push completed");
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Git push failed";

                console.error(
                    "❌ Git push failed:",
                    errorMessage
                );

                socket.send(
                    JSON.stringify({
                        type: "git.push.response",
                        repositoryPath: message.repositoryPath,
                        success: false,
                        output: "",
                        error: errorMessage,
                    })
                );
            }

            return;
        }

        if (message.type === "git.commit.request") {
            console.log("💾 Git commit requested");

            try {
                const result = await commitGitRepository(
                    message.repositoryPath,
                    message.files,
                    message.message
                );

                socket.send(
                    JSON.stringify({
                        type: "git.commit.response",
                        repositoryPath: message.repositoryPath,
                        success: true,
                        output: result.output,
                    })
                );

                console.log("💾 Git commit completed");
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Git commit failed";

                console.error(
                    "❌ Git commit failed:",
                    errorMessage
                );

                socket.send(
                    JSON.stringify({
                        type: "git.commit.response",
                        repositoryPath: message.repositoryPath,
                        success: false,
                        output: "",
                        error: errorMessage,
                    })
                );
            }

            return;
        }
    });
            socket.on("close", () => {
            console.log("🔌 Relay connection closed. Reconnecting in 3 seconds...");

            setTimeout(() => {
                connect();
            }, 3000);
        });

        socket.on("error", (error) => {
            console.error("❌ WebSocket error:", error.message);
        });
    };

    connect();
}
