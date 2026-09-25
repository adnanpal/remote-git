import type { GitRepository } from "@remote-git/protocol";

interface RepositoryListProps {
  repositories: GitRepository[];
  onSelect: (repo: GitRepository) => void;
}

function RepositoryList({ repositories, onSelect }: RepositoryListProps) {
  if (repositories.length === 0) return null;

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: "160ms" }}
    >
      <p className="text-xs font-medium tracking-wide text-emerald-700/70 uppercase mb-3">
        Repositories
      </p>

      <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 divide-y divide-emerald-900/5 overflow-hidden">
        {repositories.map((repo) => (
          <button
            key={repo.path}
            onClick={() => onSelect(repo)}
            className="group w-full text-left px-4 py-3.5 transition-colors duration-150 hover:bg-emerald-50/60"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-800">{repo.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-mono break-all">
                  {repo.path}
                </p>
              </div>
              <span className="flex-none text-emerald-500/60 transition-transform duration-150 group-hover:translate-x-0.5">
                &rarr;
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RepositoryList;