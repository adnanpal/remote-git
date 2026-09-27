import type { Workspace } from "@remote-git/protocol";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) return null;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
      <p className="text-xs font-medium tracking-[.14em] text-[#39e08a] uppercase mb-3 font-mono">
        Workspaces
      </p>

      <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {workspaces.map((workspace, index) => (
          <div
            key={workspace.path}
            className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-3 transition-all duration-200 hover:bg-white/[0.06] hover:-translate-y-0.5 animate-fade-in-up"
            style={{ animationDelay: `${120 + index * 40}ms` }}
          >
            <p className="text-sm text-[#eef1f4]">{workspace.name}</p>
            <p className="text-xs text-[#8b95a1] mt-0.5 font-mono break-all">
              {workspace.path}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkspaceList;