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

export type PingMessage = {
    type: "ping";
};

export type PongMessage = {
    type: "pong";
}

export type Message =
  | AgentRegisterMessage
  | PingMessage
  | PongMessage;