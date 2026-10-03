import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const remoteGitDir = path.join(os.homedir(), ".remote-git");
const tokenPath = path.join(remoteGitDir, "pairing-token.json");

type PairingTokenData = {
    pairingToken: string;
};

export async function getOrCreatePairingToken(): Promise<string> {
    try {
        const data = await fs.readFile(tokenPath, "utf-8");
        const parsed = JSON.parse(data) as PairingTokenData;

        if (parsed.pairingToken) {
            return parsed.pairingToken;
        }
    } catch {
        // Token doesn't exist yet. Generate one below.
    }

    await fs.mkdir(remoteGitDir, { recursive: true });

    const pairingToken = crypto.randomBytes(32).toString("hex");

    const data: PairingTokenData = {
        pairingToken,
    };

    await fs.writeFile(
        tokenPath,
        JSON.stringify(data, null, 2),
        "utf-8"
    );

    return pairingToken;
}