import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

import { loadWorkspaceConfig } from "../workspace/config.js";

const execFileAsync = promisify(execFile);

function isInsideWorkspace(
  repositoryPath: string,
  workspacePath: string
): boolean {
  const relative = path.relative(workspacePath, repositoryPath);

  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

export async function getGitStatus(repositoryPath: string) {
  const resolvedRepository = path.resolve(repositoryPath);

  // Load approved workspaces
  const config = await loadWorkspaceConfig();

  const allowed = config.workspaces.some((workspace) =>
    isInsideWorkspace(
      resolvedRepository,
      path.resolve(workspace)
    )
  );

  if (!allowed) {
    throw new Error("Repository is outside an approved workspace");
  }

  try {
    const { stdout } = await execFileAsync(
      "git",
      [
        "-C",
        resolvedRepository,
        "status",
        "--porcelain=v1",
        "-b",
      ],
      {
        maxBuffer: 1024 * 1024,
      }
    );

    const lines = stdout
      .split(/\r?\n/)
      .filter(Boolean);

    const branchLine = lines[0] ?? "";

    let branch = "unknown";
    let ahead = 0;
    let behind = 0;

    if (branchLine.startsWith("## ")) {
      const branchInfo = branchLine.slice(3);

      const trackingIndex = branchInfo.indexOf("...");

      if (trackingIndex !== -1) {
        branch = branchInfo.slice(0, trackingIndex);
      } else {
        branch = branchInfo.split(" ")[0];
      }

      const aheadMatch = branchInfo.match(/ahead (\d+)/);
      const behindMatch = branchInfo.match(/behind (\d+)/);

      ahead = aheadMatch ? Number(aheadMatch[1]) : 0;
      behind = behindMatch ? Number(behindMatch[1]) : 0;
    }

    const staged: string[] = [];
    const modified: string[] = [];
    const untracked: string[] = [];

    for (const line of lines.slice(1)) {
      if (line.length < 3) continue;

      const indexStatus = line[0];
      const workingTreeStatus = line[1];
      const filePath = line.slice(3);

      if (indexStatus !== " ") {
        staged.push(filePath);
      }

      if (
        workingTreeStatus === "M" ||
        workingTreeStatus === "D"
      ) {
        modified.push(filePath);
      }

      if (indexStatus === "?" && workingTreeStatus === "?") {
        untracked.push(filePath);
      }
    }

    return {
      repositoryPath: resolvedRepository,
      branch,
      clean:
        staged.length === 0 &&
        modified.length === 0 &&
        untracked.length === 0,
      staged,
      modified,
      untracked,
      ahead,
      behind,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Git status failed: ${error.message}`);
    }

    throw new Error("Git status failed");
  }
}