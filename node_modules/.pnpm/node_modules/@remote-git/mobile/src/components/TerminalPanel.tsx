export type TerminalLineVariant =
  | "command"
  | "default"
  | "muted"
  | "success"
  | "warning"
  | "error";

export interface TerminalLine {
  text: string;
  variant?: TerminalLineVariant;
}

interface TerminalPanelProps {
  title?: string;
  lines: TerminalLine[];
  showCursor?: boolean;
}

const variantClass: Record<TerminalLineVariant, string> = {
  command: "text-white",
  default: "text-zinc-300",
  muted: "text-zinc-500",
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
};

function TerminalPanel({
  title = "remote-git",
  lines,
  showCursor = true,
}: TerminalPanelProps) {
  return (
    <div className="rounded-2xl border border-emerald-500/10 bg-zinc-950 shadow-lg shadow-emerald-900/10 overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.03]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 text-xs text-zinc-500 font-mono">{title}</span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 font-mono text-[13px] leading-6 overflow-x-auto">
        {lines.map((line, index) => (
          <div
            key={index}
            className={variantClass[line.variant ?? "default"]}
          >
            {line.variant === "command" ? `$ ${line.text}` : line.text}
          </div>
        ))}

        {showCursor && (
          <div className="text-white">
            <span className="text-zinc-500">$ </span>
            <span className="inline-block w-2 h-4 -mb-0.5 bg-emerald-400 animate-cursor-blink" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TerminalPanel;