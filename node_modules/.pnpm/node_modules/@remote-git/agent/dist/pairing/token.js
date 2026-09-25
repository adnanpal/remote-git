import crypto from "node:crypto";
export function generatePairingToken() {
    return crypto.randomBytes(32).toString("hex");
}
