import type { Workspace } from "@remote-git/protocol";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) return null;

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: "80ms" }}
    >
      <p className="text-xs font-medium tracking-wide text-emerald-700/70 uppercase mb-3">
        Workspaces
      </p>

      <div className="space-y-2">
        {workspaces.map((workspace, index) => (
          <div
            key={workspace.path}
            className="rounded-xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 px-4 py-3 transition-all duration-200 hover:bg-white/70 hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up"
            style={{ animationDelay: `${120 + index * 40}ms` }}
          >
            <p className="text-sm text-slate-800">{workspace.name}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-mono break-all">
              {workspace.path}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkspaceList;