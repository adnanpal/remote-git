import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
const CONFIG_DIR = path.join(os.homedir(), ".remote-git");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const defaultConfig = {
    workspaces: [],
};
export async function loadWorkspaceConfig() {
    try {
        const data = await fs.readFile(CONFIG_FILE, "utf-8");
        return JSON.parse(data);
    }
    catch {
        return defaultConfig;
    }
}
export async function saveWorkspaceConfig(config) {
    await fs.mkdir(CONFIG_DIR, {
        recursive: true,
    });
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
export async function getWorkspaces() {
    const config = await loadWorkspaceConfig();
    return config.workspaces.map((workspacePath) => ({
        name: path.basename(workspacePath),
        path: workspacePath,
    }));
}
export async function addWorkspace(workspacePath) {
    const config = await loadWorkspaceConfig();
    const resolvedPath = path.resolve(workspacePath);
    if (!config.workspaces.includes(resolvedPath)) {
        config.workspaces.push(resolvedPath);
    }
    await saveWorkspaceConfig(config);
    return config;
}
