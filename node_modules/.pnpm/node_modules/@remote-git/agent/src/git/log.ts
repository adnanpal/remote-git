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

export async function getGitLog(
  repositoryPath: string,
  limit = 20
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

  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  try {
    const { stdout } = await execFileAsync(
      "git",
      [
        "-C",
        resolvedRepository,
        "log",
        `-${safeLimit}`,
        "--pretty=format:%H%x09%h%x09%s%x09%an%x09%aI",
      ],
      {
        maxBuffer: 1024 * 1024,
      }
    );

    const commits = stdout
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [
          hash,
          shortHash,
          subject,
          author,
          date,
        ] = line.split("\t");

        return {
          hash,
          shortHash,
          subject,
          author,
          date,
        };
      });

    return commits;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Git log failed: ${error.message}`);
    }

    throw new Error("Git log failed");
  }
}