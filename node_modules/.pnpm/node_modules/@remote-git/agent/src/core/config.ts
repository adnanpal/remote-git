import crypto from "node:crypto";

export function generateDeviceId(): string {
    return `dev_${crypto.randomUUID()}`;
}