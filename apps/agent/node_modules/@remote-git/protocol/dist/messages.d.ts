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
export type Message = AgentRegisterMessage | PingMessage | PongMessage | PhonePairMessage | PairSuccessMessage | PairFailedMessage | PhoneConnectedMessage | MachineInfoMessage;
