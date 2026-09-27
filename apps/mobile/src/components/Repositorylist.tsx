import type { GitRepository } from "@remote-git/protocol";

interface RepositoryListProps {
  repositories: GitRepository[];
  onSelect: (repo: GitRepository) => void;
}

function RepositoryList({ repositories, onSelect }: RepositoryListProps) {
  if (repositories.length === 0) return null;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "160ms" }}>
      <p className="text-xs font-medium tracking-[.14em] text-[#39e08a] uppercase mb-3 font-mono">
        Repositories
      </p>

      <div className="grid gap-2.5 md:grid-cols-2">
        {repositories.map((repo) => (
          <button
            key={repo.path}
            onClick={() => onSelect(repo)}
            className="group text-left rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-3.5 transition-all duration-200 hover:bg-[#39e08a]/[0.08] hover:border-[#39e08a]/30 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-[#eef1f4]">{repo.name}</p>
                <p className="text-xs text-[#8b95a1] mt-0.5 font-mono break-all">
                  {repo.path}
                </p>
              </div>
              <span className="flex-none text-[#39e08a]/70 transition-transform duration-150 group-hover:translate-x-0.5">
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