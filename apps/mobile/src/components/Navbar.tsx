interface NavbarProps {
  connected: boolean;
  hostname?: string;
}

function Navbar({ connected, hostname }: NavbarProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-20 animate-fade-in-up">
      <div className="max-w-md mx-auto mt-4 px-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/60 backdrop-blur-xl shadow-sm shadow-emerald-900/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white text-xs font-semibold">
              R
            </span>
            <span className="text-sm font-semibold text-slate-800">
              Remote Git
            </span>
          </div>

          {connected && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {hostname ?? "connected"}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;