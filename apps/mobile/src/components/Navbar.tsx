interface NavbarProps {
  connected: boolean;
  hostname?: string;
}

function Navbar({ connected, hostname }: NavbarProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-20 animate-fade-in-up">
      <div className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto mt-4 px-5 sm:px-8">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a0d12]/80 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#39e08a] to-[#1f8f56] text-[#04140b] text-xs font-bold font-mono">
              R
            </span>
            <span className="text-sm font-semibold text-[#eef1f4]">
              Remote-Git
            </span>
          </div>

          {connected && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39e08a] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#39e08a]" />
              </span>
              <span className="text-xs text-[#8b95a1] font-mono">
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