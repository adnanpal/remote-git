import type { MachineInfoMessage } from "@remote-git/protocol";

interface ConnectionStatusProps {
  machine: MachineInfoMessage["machine"];
  status: string;
}

function ConnectionStatus({ machine, status }: ConnectionStatusProps) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 px-5 py-4 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-sm text-slate-700">{status}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1.5 font-mono">
        {machine.hostname}
      </p>

      <details className="mt-2 group">
        <summary className="text-xs text-emerald-700/70 cursor-pointer select-none hover:text-emerald-700 list-none">
          Device details
        </summary>
        <div className="mt-2 space-y-1.5 text-xs font-mono text-slate-500 animate-fade-in">
          <div className="flex justify-between gap-4">
            <span>Platform</span>
            <span className="text-slate-700">{machine.platform}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Architecture</span>
            <span className="text-slate-700">{machine.architecture}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>CPU</span>
            <span className="text-slate-700 text-right">{machine.cpu}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Cores</span>
            <span className="text-slate-700">{machine.cpuCores}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Memory</span>
            <span className="text-slate-700">{machine.totalMemory} GB</span>
          </div>
        </div>
      </details>
    </div>
  );
}

export default ConnectionStatus;