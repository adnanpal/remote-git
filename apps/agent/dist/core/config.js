import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
const REMOTE_GIT_DIR = path.join(os.homedir(), ".remote-git");
const IDENTITY_FILE = path.join(REMOTE_GIT_DIR, "identity.json");
export async function getOrCreateDeviceId() {
    try {
        const raw = await fs.readFile(IDENTITY_FILE, "utf-8");
        const identity = JSON.parse(raw);
        if (identity.deviceId) {
            return identity.deviceId;
        }
    }
    catch {
        // Identity doesn't exist yet — create it below.
    }
    await fs.mkdir(REMOTE_GIT_DIR, { recursive: true });
    const identity = {
        deviceId: `dev_${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
    };
    await fs.writeFile(IDENTITY_FILE, JSON.stringify(identity, null, 2), "utf-8");
    return identity.deviceId;
}
