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

function getExecErrorOutput(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      stdout?: string;
      stderr?: string;
      message?: string;
    };

    const output = [candidate.stdout, candidate.stderr]
      .filter(Boolean)
      .join("\n")
      .trim();

    return output || candidate.message || "Git push failed";
  }

  return "Git push failed";
}

export async function pushGitRepository(repositoryPath: string) {
  const resolvedRepository = path.resolve(repositoryPath);

  const config = await loadWorkspaceConfig();

  const allowed = config.workspaces.some((workspace) =>
    isInsideWorkspace(
      resolvedRepository,
      path.resolve(workspace)
    )
  );

  if (!allowed) {
    throw new Error(
      "Repository is outside an approved workspace"
    );
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      "git",
      [
        "-C",
        resolvedRepository,
        "push",
      ],
      {
        maxBuffer: 5 * 1024 * 1024,
      }
    );

    return {
      success: true,
      output: [stdout, stderr]
        .filter(Boolean)
        .join("\n")
        .trim(),
    };
  } catch (error) {
    throw new Error(getExecErrorOutput(error));
  }
}