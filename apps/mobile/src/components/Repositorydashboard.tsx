import { useState } from "react";
import type { GitRepository, GitStatusResponseMessage, GitCommit, GitDiffResponseMessage } from "@remote-git/protocol";
import GitStatus from "./GitStatus";

type Tab = "status" | "commits" | "changes";

interface RepositoryDashboardProps {
    repository: GitRepository;
    gitStatus: GitStatusResponseMessage | null;
    onBack: () => void;
    gitDiff: GitDiffResponseMessage | null;
    gitLog: GitCommit[];
    onRequestDiff: (filePath: string) => void;
}

function RepositoryDashboard({
    repository,
    gitStatus,
    gitLog,
    gitDiff,
    onRequestDiff,
    onBack,
}: RepositoryDashboardProps) {
    const [tab, setTab] = useState<Tab>("status");

    return (
        <div className="w-full max-w-md mx-auto px-5 pt-28 pb-14 animate-fade-in-up">
            <button
                onClick={onBack}
                className="text-sm text-slate-500 hover:text-emerald-700 transition-colors"
            >
                &larr; Repositories
            </button>

            <div className="mt-3 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 p-5">
                <h1 className="text-xl font-semibold text-slate-900">
                    {repository.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-mono break-all">
                    {repository.path}
                </p>

                {/* Tabs */}
                <div className="mt-5 flex gap-1.5 rounded-full bg-emerald-900/5 p-1 w-fit">
                    <button
                        onClick={() => setTab("status")}
                        className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 ${tab === "status"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Status
                    </button>
                    <button
                        onClick={() => setTab("commits")}
                        className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 ${tab === "commits"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Commits
                    </button>
                    <button
                        onClick={() => setTab("changes")}
                        
                        className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 ${tab === "changes"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        Changes
                    </button>
                </div>

                <div key={tab} className="mt-5 animate-fade-in">
                    {tab === "status" && (
                        <GitStatus gitStatus={gitStatus} />
                    )}

                    {tab === "commits" && (
                        <div className="space-y-3">
                            {gitLog.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No commits found.
                                </p>
                            ) : (
                                gitLog.map((commit) => (
                                    <div
                                        key={commit.hash}
                                        className="rounded-xl border border-white/60 bg-white/40 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-medium text-slate-900">
                                                {commit.subject}
                                            </p>

                                            <span className="shrink-0 rounded-md bg-slate-900/5 px-2 py-1 font-mono text-xs text-slate-500">
                                                {commit.shortHash}
                                            </span>
                                        </div>

                                        <div className="mt-2 text-xs text-slate-500">
                                            {commit.author}
                                        </div>

                                        <div className="mt-1 text-xs text-slate-400">
                                            {new Date(commit.date).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                   {tab === "changes" && (
  <div className="space-y-2">
    {!gitStatus ||
    (gitStatus.modified.length === 0 &&
      gitStatus.staged.length === 0 &&
      gitStatus.untracked.length === 0) ? (
      <p className="text-sm text-slate-500">
        No changes.
      </p>
    ) : (
      <>
        {gitStatus.modified.map((filePath) => (
          <button
            key={`modified-${filePath}`}
            onClick={() => onRequestDiff(filePath)}
            className="w-full text-left rounded-xl border border-white/60 bg-white/40 p-3 hover:bg-white/70 transition"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-amber-600">
                M
              </span>

              <span className="font-mono text-xs text-slate-700 break-all">
                {filePath}
              </span>
            </div>
          </button>
        ))}

        {gitStatus.staged.map((filePath) => (
          <button
            key={`staged-${filePath}`}
            onClick={() => onRequestDiff(filePath)}
            className="w-full text-left rounded-xl border border-white/60 bg-white/40 p-3 hover:bg-white/70 transition"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-emerald-600">
                S
              </span>

              <span className="font-mono text-xs text-slate-700 break-all">
                {filePath}
              </span>
            </div>
          </button>
        ))}

        {gitStatus.untracked.map((filePath) => (
          <button
            key={`untracked-${filePath}`}
            onClick={() => onRequestDiff(filePath)}
            className="w-full text-left rounded-xl border border-white/60 bg-white/40 p-3 hover:bg-white/70 transition"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-blue-600">
                ?
              </span>

              <span className="font-mono text-xs text-slate-700 break-all">
                {filePath}
              </span>
            </div>
          </button>
        ))}
      </>
    )}
  </div>
)}
                </div>
            </div>
        </div>
    );
}

export default RepositoryDashboard;