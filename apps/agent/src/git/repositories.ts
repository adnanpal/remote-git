import fs from "node:fs/promises";
import path from "node:path";

import type { GitRepository } from "@remote-git/protocol";

import { loadWorkspaceConfig } from "../workspace/config.js";

async function isGitRepository(
    directory: string
) {
    try {
        const gitPath = path.join(
            directory,
            ".git"
        );

        const stat = await fs.stat(gitPath);

        return (
            stat.isDirectory() ||
            stat.isFile()
        );
    } catch {
        return false;
    }
}

async function scanDirectory(
    directory: string,
    repositories: Map<string, GitRepository>
) {
    if (await isGitRepository(directory)) {
        const normalizedPath = path.normalize(
            path.resolve(directory)
        );

        if (!repositories.has(normalizedPath)) {
            repositories.set(normalizedPath, {
                name: path.basename(directory),
                path: directory,
            });
        }

        // Don't scan inside a repository.
        return;
    }

    let entries;

    try {
        entries = await fs.readdir(
            directory,
            {
                withFileTypes: true,
            }
        );
    } catch {
        return;
    }

    for (const entry of entries) {
        if (!entry.isDirectory()) {
            continue;
        }

        // Ignore common directories that shouldn't be scanned.
        if (
            entry.name === "node_modules" ||
            entry.name === ".git" ||
            entry.name === "AppData"
        ) {
            continue;
        }

        const childPath = path.join(
            directory,
            entry.name
        );

        await scanDirectory(
            childPath,
            repositories
        );
    }
}

export async function discoverRepositories() {
    const config =
        await loadWorkspaceConfig();

    const repositories = new Map<
        string,
        GitRepository
    >();

    for (const workspace of config.workspaces) {
        await scanDirectory(
            workspace,
            repositories
        );
    }

    return Array.from(
        repositories.values()
    );
}