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

export async function getGitDiff(
  repositoryPath: string,
  filePath?: string
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

  try {
    const args = [
      "-C",
      resolvedRepository,
      "diff",
    ];

    if (filePath) {
      // Make sure the requested file stays inside the repository.
      const resolvedFile = path.resolve(
        resolvedRepository,
        filePath
      );

      if (
        !isInsideWorkspace(
          resolvedFile,
          resolvedRepository
        )
      ) {
        throw new Error(
          "File is outside the selected repository"
        );
      }

      const relativeFile = path.relative(
        resolvedRepository,
        resolvedFile
      );

      args.push("--", relativeFile);
    }

    const { stdout } = await execFileAsync(
      "git",
      args,
      {
        maxBuffer: 5 * 1024 * 1024,
      }
    );

    return stdout;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Git diff failed: ${error.message}`);
    }

    throw new Error("Git diff failed");
  }
}