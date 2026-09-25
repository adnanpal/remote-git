export type AgentRegisterMessage = {
    type: "agent.register";
    deviceId: string;
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
export type PairingInfo = {
    version: 1;
    deviceId: string;
    pairingToken: string;
    relay: string;
};
export type PingMessage = {
    type: "ping";
};
export type PongMessage = {
    type: "pong";
};
export type Message = AgentRegisterMessage | PingMessage | PongMessage;
