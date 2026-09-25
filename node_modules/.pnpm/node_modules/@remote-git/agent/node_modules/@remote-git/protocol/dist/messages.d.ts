export type AgentRegisterMessage = {
    type: "agent.register";
    deviceId: string;
    pairingToken: string;
    machine: {
        hostname: string;
        platform: string;
        architecture: string;
        cpu: string;
        cpuCores: number;
        totalMemory: number;
        freeMemory: number;
    };
};
export type MachineInfoMessage = {
    type: "machine.info";
    machine: AgentRegisterMessage["machine"];
};
export type PhoneConnectedMessage = {
    type: "phone.connected";
};
export type GitRepositoriesRequestMessage = {
    type: "git.repositories.request";
};
export type GitStatusRequestMessage = {
    type: "git.status.request";
    repositoryPath: string;
};
export type GitStatusResponseMessage = {
    type: "git.status.response";
    repositoryPath: string;
    branch: string;
    clean: boolean;
    staged: string[];
    modified: string[];
    untracked: string[];
    ahead: number;
    behind: number;
    error?: string;
};
export type GitLogRequestMessage = {
    type: "git.log.request";
    repositoryPath: string;
    limit?: number;
};
export type GitCommit = {
    hash: string;
    shortHash: string;
    subject: string;
    author: string;
    date: string;
};
export type GitLogResponseMessage = {
    type: "git.log.response";
    repositoryPath: string;
    commits: GitCommit[];
    error?: string;
};
export type GitDiffRequestMessage = {
    type: "git.diff.request";
    repositoryPath: string;
    filePath?: string;
};
export type GitDiffResponseMessage = {
    type: "git.diff.response";
    repositoryPath: string;
    filePath?: string;
    diff: string;
    error?: string;
};
export type GitRepository = {
    name: string;
    path: string;
};
export type GitRepositoriesResponseMessage = {
    type: "git.repositories.response";
    repositories: GitRepository[];
};
export type PairingInfo = {
    version: 1;
    deviceId: string;
    pairingToken: string;
    relay: string;
};
export type PhonePairMessage = {
    type: "phone.pair";
    deviceId: string;
    pairingToken: string;
};
export type PairSuccessMessage = {
    type: "pair.success";
    deviceId: string;
};
export type PairFailedMessage = {
    type: "pair.failed";
    reason: string;
};
export type PingMessage = {
    type: "ping";
};
export type PongMessage = {
    type: "pong";
};
export type Workspace = {
    name: string;
    path: string;
};
export type WorkspaceListRequestMessage = {
    type: "workspace.list.request";
};
export type WorkspaceListResponseMessage = {
    type: "workspace.list.response";
    workspaces: Workspace[];
};
export type WorkspaceAddRequestMessage = {
    type: "workspace.add.request";
};
export type WorkspaceAddResponseMessage = {
    type: "workspace.add.response";
    success: boolean;
    workspace?: Workspace;
    error?: string;
};
export type Message = AgentRegisterMessage | PingMessage | PongMessage | PairingInfo | PhonePairMessage | PairSuccessMessage | PairFailedMessage | PhoneConnectedMessage | MachineInfoMessage | GitStatusRequestMessage | GitStatusResponseMessage | GitRepositoriesRequestMessage | WorkspaceAddRequestMessage | WorkspaceAddResponseMessage | WorkspaceListRequestMessage | WorkspaceListResponseMessage | GitLogRequestMessage | GitCommit | GitLogResponseMessage | GitRepositoriesResponseMessage | GitDiffRequestMessage | GitDiffResponseMessage;
