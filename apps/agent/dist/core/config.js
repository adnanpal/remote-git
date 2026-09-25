import crypto from "node:crypto";
export function generateDeviceId() {
    return `dev_${crypto.randomUUID()}`;
}
