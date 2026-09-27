import { useState } from "react";
import type {
  GitRepository,
  GitStatusResponseMessage,
  GitCommit,
  GitPushResponseMessage,
  GitDiffResponseMessage,
  GitCommitResponseMessage
} from "@remote-git/protocol";

import GitStatus from "./GitStatus";

type Tab = "status" | "commits" | "changes";

interface RepositoryDashboardProps {
  repository: GitRepository;
  gitStatus: GitStatusResponseMessage | null;
  gitLog: GitCommit[];
  gitDiff: GitDiffResponseMessage | null;

  gitPush: GitPushResponseMessage | null;
  isPushing: boolean;
  gitCommit: GitCommitResponseMessage | null;
  isCommitting: boolean;

  onCommit: (files: string[], message: string) => void;

  onPush: () => void;
  onRequestDiff: (filePath?: string) => void;
  onBack: () => void;
}

function RepositoryDashboard({
  repository,
  gitStatus,
  gitLog,
  gitDiff,
  gitCommit,
  isCommitting,
  onCommit,
  gitPush,
  isPushing,
  onPush,
  onRequestDiff,
  onBack,
}: RepositoryDashboardProps) {

  const [selectedFiles, setSelectedFiles] =
    useState<string[]>([]);

  const [commitMessage, setCommitMessage] =
    useState("");
  const [tab, setTab] = useState<Tab>("status");

  const tabs: { id: Tab; label: string }[] = [
    { id: "status", label: "Status" },
    { id: "commits", label: "Commits" },
    { id: "changes", label: "Changes" },
  ];

  const changedFiles = [
    ...(gitStatus?.staged ?? []).map((file) => ({
      path: file,
      type: "staged" as const,
    })),
    ...(gitStatus?.modified ?? []).map((file) => ({
      path: file,
      type: "modified" as const,
    })),
    ...(gitStatus?.untracked ?? []).map((file) => ({
      path: file,
      type: "untracked" as const,
    })),
  ];

  const toggleFile = (filePath: string) => {
    setSelectedFiles((current) =>
      current.includes(filePath)
        ? current.filter((file) => file !== filePath)
        : [...current, filePath]
    );
  };
  const handleCommit = () => {
    const message = commitMessage.trim();

    if (
      selectedFiles.length === 0 ||
      !message ||
      isCommitting
    ) {
      return;
    }

    onCommit(selectedFiles, message);
  };
  return (
    <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl mx-auto px-5 sm:px-8 pt-28 md:pt-32 pb-14 animate-fade-in-up">
      {/* Back */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-sm text-[#7f8792] hover:text-[#eef1f4] transition-colors"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">
          ←
        </span>
        Repositories
      </button>

      {/* Repository header */}
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-medium tracking-[.16em] uppercase text-[#39e08a] font-mono">
                Repository
              </p>

              <h1 className="mt-2 text-xl font-semibold text-[#eef1f4] truncate">
                {repository.name}
              </h1>

              <p className="mt-1 text-xs text-[#6f7782] font-mono break-all">
                {repository.path}
              </p>
            </div>

            {gitStatus && (
              <div className="shrink-0 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${gitStatus.clean
                    ? "bg-[#39e08a]"
                    : "bg-[#f5b95e]"
                    }`}
                />

                <span className="text-xs text-[#8b929d]">
                  {gitStatus.clean ? "Clean" : "Changes"}
                </span>
              </div>
            )}
          </div>

          {/* Branch */}
          {/* Branch */}
          {gitStatus && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3.5 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#39e08a] font-mono text-xs">
                  ⎇
                </span>

                <span className="text-xs text-[#c7ccd3] font-mono truncate">
                  {gitStatus.branch}
                </span>
              </div>

              {(gitStatus.ahead > 0 || gitStatus.behind > 0) && (
                <div className="flex gap-3 text-[11px] font-mono shrink-0">
                  {gitStatus.ahead > 0 && (
                    <span className="text-[#39e08a]">
                      ↑{gitStatus.ahead}
                    </span>
                  )}

                  {gitStatus.behind > 0 && (
                    <span className="text-[#f5b95e]">
                      ↓{gitStatus.behind}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Push */}
          <div className="mt-4">
            <button
              onClick={onPush}
              disabled={isPushing}
              className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all ${isPushing
                  ? "border-white/5 bg-white/[0.03] text-[#6f7782] cursor-wait"
                  : "border-[#39e08a]/20 bg-[#39e08a]/10 text-[#39e08a] hover:bg-[#39e08a]/15 hover:border-[#39e08a]/30"
                }`}
            >
              {isPushing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-[#6f7782] border-t-transparent animate-spin" />
                  Pushing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>↑</span>
                  Push to remote
                </span>
              )}
            </button>
          </div>

          {/* Push result */}
          {gitPush && (
            <div
              className={`mt-3 rounded-xl border p-4 animate-fade-in ${gitPush.success
                  ? "border-[#39e08a]/20 bg-[#39e08a]/5"
                  : "border-[#ff6b6b]/20 bg-[#ff6b6b]/5"
                }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${gitPush.success
                      ? "bg-[#39e08a]"
                      : "bg-[#ff6b6b]"
                    }`}
                />

                <p
                  className={`text-xs font-medium ${gitPush.success
                      ? "text-[#39e08a]"
                      : "text-[#ff8b8b]"
                    }`}
                >
                  {gitPush.success
                    ? "Push completed"
                    : "Push failed"}
                </p>
              </div>

              {(gitPush.output || gitPush.error) && (
                <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-black/30 p-3 text-[11px] leading-5 text-[#9da5af] font-mono whitespace-pre-wrap">
                  {gitPush.output || gitPush.error}
                </pre>
              )}
            </div>
          )}

          {/* Tabs */}

          {/* Tabs */}
          <div className="mt-5 grid grid-cols-3 rounded-xl border border-white/5 bg-black/20 p-1">
            {tabs.map((item) => {
              const active = tab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`relative rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${active
                    ? "bg-white/[0.08] text-[#eef1f4]"
                    : "text-[#6f7782] hover:text-[#c7ccd3] hover:bg-white/[0.03]"
                    }`}
                >
                  {item.label}

                  {item.id === "changes" &&
                    changedFiles.length > 0 && (
                      <span className="ml-1.5 text-[10px] text-[#f5b95e]">
                        {changedFiles.length}
                      </span>
                    )}

                  {active && (
                    <span className="absolute left-1/2 -bottom-1 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#39e08a]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="border-t border-white/5 p-5 sm:p-6">
          {tab === "status" && (
            <div className="animate-fade-in">
              <GitStatus gitStatus={gitStatus} />
            </div>
          )}

          {tab === "commits" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#eef1f4]">
                    Commit history
                  </p>
                  <p className="text-xs text-[#6f7782] mt-1">
                    Recent commits on this repository
                  </p>
                </div>

                <span className="text-[10px] font-mono text-[#6f7782]">
                  {gitLog.length} commits
                </span>
              </div>

              {gitLog.length === 0 ? (
                <EmptyState message="No commits found." />
              ) : (
                <div className="space-y-2">
                  {gitLog.map((commit) => (
                    <div
                      key={commit.hash}
                      className="rounded-xl border border-white/5 bg-black/20 p-3.5 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-[#39e08a] shrink-0" />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-[#dce0e5] leading-5">
                            {commit.subject}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#6f7782]">
                            <span className="font-mono text-[#39e08a]">
                              {commit.shortHash}
                            </span>

                            <span>•</span>

                            <span>{commit.author}</span>

                            <span>•</span>

                            <span>
                              {formatCommitDate(commit.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "changes" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#eef1f4]">
                    Working tree
                  </p>
                  <p className="text-xs text-[#6f7782] mt-1">
                    Files changed since the last commit
                  </p>
                </div>

                <span className="text-[10px] font-mono text-[#6f7782]">
                  {changedFiles.length} files
                </span>
              </div>

             {changedFiles.length === 0 ? (
  <EmptyState message="Working tree is clean." />
) : (
  <div className="space-y-3">
    {changedFiles.map((file) => {
      const selected = selectedFiles.includes(file.path);

      return (
        <div
          key={`${file.type}-${file.path}`}
          className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3.5"
        >
          <button
            type="button"
            onClick={() => toggleFile(file.path)}
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
              selected
                ? "border-[#39e08a] bg-[#39e08a] text-black"
                : "border-white/15"
            }`}
          >
            {selected ? "✓" : ""}
          </button>

          <button
            type="button"
            onClick={() => onRequestDiff(file.path)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                file.type === "staged"
                  ? "bg-[#39e08a]"
                  : file.type === "modified"
                    ? "bg-[#f5b95e]"
                    : "bg-[#8b929d]"
              }`}
            />

            <span className="min-w-0 flex-1 truncate text-xs font-mono text-[#c7ccd3]">
              {file.path}
            </span>

            <span className="text-[10px] text-[#6f7782] shrink-0">
              {file.type}
            </span>
          </button>
        </div>
      );
    })}

    {/* Commit message */}
    <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
      <label className="mb-2 block text-xs font-medium text-[#c7ccd3]">
        Commit message
      </label>

      <input
        value={commitMessage}
        onChange={(event) =>
          setCommitMessage(event.target.value)
        }
        placeholder="What did you change?"
        disabled={isCommitting}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-[#c7ccd3] outline-none placeholder:text-[#4f5661] focus:border-[#39e08a]/30 disabled:opacity-50"
      />

      <button
        type="button"
        onClick={handleCommit}
        disabled={
          selectedFiles.length === 0 ||
          !commitMessage.trim() ||
          isCommitting
        }
        className={`mt-3 w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
          selectedFiles.length === 0 ||
          !commitMessage.trim() ||
          isCommitting
            ? "cursor-not-allowed border-white/5 bg-white/[0.03] text-[#555d68]"
            : "border-[#39e08a]/20 bg-[#39e08a]/10 text-[#39e08a] hover:bg-[#39e08a]/15"
        }`}
      >
        {isCommitting ? "Committing..." : "Commit changes"}
      </button>
    </div>

    {/* Commit result */}
    {gitCommit && (
      <div
        className={`rounded-xl border p-4 ${
          gitCommit.success
            ? "border-[#39e08a]/20 bg-[#39e08a]/5"
            : "border-[#ff6b6b]/20 bg-[#ff6b6b]/5"
        }`}
      >
        <p
          className={`text-xs font-medium ${
            gitCommit.success
              ? "text-[#39e08a]"
              : "text-[#ff8b8b]"
          }`}
        >
          {gitCommit.success
            ? "Commit created"
            : "Commit failed"}
        </p>

        {(gitCommit.output || gitCommit.error) && (
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-black/30 p-3 text-[11px] leading-5 text-[#9da5af] font-mono whitespace-pre-wrap">
            {gitCommit.output || gitCommit.error}
          </pre>
        )}
      </div>
    )}
  </div>
)}

              {gitDiff && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-[#c7ccd3]">
                      Diff
                    </p>

                    {gitDiff.filePath && (
                      <span className="text-[10px] font-mono text-[#6f7782] truncate max-w-[60%]">
                        {gitDiff.filePath}
                      </span>
                    )}
                  </div>

                  {gitDiff.error ? (
                    <div className="rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/5 p-3 text-xs text-[#ff8b8b]">
                      {gitDiff.error}
                    </div>
                  ) : (
                    <pre className="max-h-[420px] overflow-auto rounded-xl border border-white/5 bg-black/40 p-4 text-[11px] leading-5 text-[#aeb5be] font-mono whitespace-pre-wrap">
                      {gitDiff.diff || "No diff available."}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
      <p className="text-xs text-[#6f7782]">{message}</p>
    </div>
  );
}

function formatCommitDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default RepositoryDashboard;