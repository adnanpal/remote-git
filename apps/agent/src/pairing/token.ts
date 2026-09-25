import crypto from "node:crypto";

export function generatePairingToken(): string{
    return crypto.randomBytes(32).toString("hex");
}