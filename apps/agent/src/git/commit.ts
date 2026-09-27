import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { loadWorkspaceConfig } from "../workspace/config.js";

const execFileAsync = promisify(execFile);

function isInsideWorkspace(
  targetPath: string,
  workspacePath: string
): boolean {
  const relative = path.relative(workspacePath, targetPath);

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

    return output || candidate.message || "Git commit failed";
  }

  return "Git commit failed";
}

export async function commitGitRepository(
  repositoryPath: string,
  files: string[],
  message: string
) {
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

  const commitMessage = message.trim();

  if (!commitMessage) {
    throw new Error("Commit message cannot be empty");
  }

  if (files.length === 0) {
    throw new Error("No files selected for commit");
  }

  const resolvedFiles: string[] = [];

  for (const file of files) {
    const resolvedFile = path.resolve(
      resolvedRepository,
      file
    );

    if (
      !isInsideWorkspace(
        resolvedFile,
        resolvedRepository
      )
    ) {
      throw new Error(
        `File is outside the selected repository: ${file}`
      );
    }

    resolvedFiles.push(
      path.relative(resolvedRepository, resolvedFile)
    );
  }

  try {
    // Stage only the files explicitly selected by the user.
    await execFileAsync(
      "git",
      [
        "-C",
        resolvedRepository,
        "add",
        "--",
        ...resolvedFiles,
      ],
      {
        maxBuffer: 5 * 1024 * 1024,
      }
    );

    // Create the commit.
    const { stdout, stderr } = await execFileAsync(
      "git",
      [
        "-C",
        resolvedRepository,
        "commit",
        "-m",
        commitMessage,
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