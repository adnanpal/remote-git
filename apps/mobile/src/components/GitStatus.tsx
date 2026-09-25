import type { GitStatusResponseMessage } from "@remote-git/protocol";
import TerminalPanel, { type TerminalLine } from "./TerminalPanel";

interface GitStatusProps {
  gitStatus: GitStatusResponseMessage | null;
}

function buildTerminalLines(status: GitStatusResponseMessage): TerminalLine[] {
  const lines: TerminalLine[] = [
    { text: "git status", variant: "command" },
    { text: `On branch ${status.branch}`, variant: "default" },
  ];

  if (status.error) {
    lines.push({ text: status.error, variant: "error" });
    return lines;
  }

  if (status.clean) {
    lines.push({ text: "nothing to commit, working tree clean", variant: "success" });
    return lines;
  }

  lines.push({ text: "Changes not staged for commit:", variant: "muted" });

  for (const file of status.staged) {
    lines.push({ text: `  staged:    ${file}`, variant: "success" });
  }
  for (const file of status.modified) {
    lines.push({ text: `  modified:  ${file}`, variant: "warning" });
  }
  for (const file of status.untracked) {
    lines.push({ text: `  untracked: ${file}`, variant: "default" });
  }

  if (status.ahead > 0) {
    lines.push({ text: `Your branch is ahead by ${status.ahead} commit(s)`, variant: "muted" });
  }
  if (status.behind > 0) {
    lines.push({ text: `Your branch is behind by ${status.behind} commit(s)`, variant: "muted" });
  }

  return lines;
}

function GitStatus({ gitStatus }: GitStatusProps) {
  if (!gitStatus) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        Loading Git status...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Summary */}
      <div className="rounded-xl border border-emerald-900/5 bg-white/70 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Branch</span>
          <span className="text-sm font-mono text-slate-800">
            {gitStatus.branch}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              gitStatus.clean ? "bg-emerald-500" : "bg-amber-400"
            }`}
          />
          <span className="text-sm text-slate-700">
            {gitStatus.clean ? "Working tree clean" : "Changes detected"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-sm font-mono text-slate-800">
              {gitStatus.staged.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Staged</p>
          </div>
          <div>
            <p className="text-sm font-mono text-slate-800">
              {gitStatus.modified.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Modified</p>
          </div>
          <div>
            <p className="text-sm font-mono text-slate-800">
              {gitStatus.untracked.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Untracked</p>
          </div>
          <div>
            <p className="text-sm font-mono text-slate-800">
              {gitStatus.ahead}/{gitStatus.behind}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Ahead/Behind</p>
          </div>
        </div>

        {gitStatus.error && (
          <p className="text-red-500 text-sm mt-4">{gitStatus.error}</p>
        )}
      </div>

      {/* Terminal rendering of the same data */}
      <TerminalPanel lines={buildTerminalLines(gitStatus)} />
    </div>
  );
}

export default GitStatus;