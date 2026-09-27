import { useEffect, useState } from "react";
import type { TerminalLine, TerminalLineVariant } from "./TerminalPanel";

// A terminal that reveals its lines one at a time — used for illustrative
// previews (hero, how-it-works) where nothing real has happened yet.
// TerminalPanel itself stays static/instant, since it renders real git data.

const variantClass: Record<TerminalLineVariant, string> = {
  command: "text-white",
  default: "text-[#c7ccd3]",
  muted: "text-[#5b6470]",
  success: "text-[#39e08a]",
  warning: "text-[#f5b95e]",
  error: "text-[#ff6b6b]",
};

interface AnimatedTerminalProps {
  title?: string;
  lines: TerminalLine[];
  lineDelay?: number;
}

function AnimatedTerminal({
  title = "remote-git — zsh",
  lines,
  lineDelay = 450,
}: AnimatedTerminalProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (lines.length === 0) return;

    const id = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= lines.length) {
          clearInterval(id);
          return lines.length;
        }
        return c + 1;
      });
    }, lineDelay);

    return () => clearInterval(id);
  }, [lines, lineDelay]);

  const visible = lines.slice(0, count);

  return (
    <div className="rounded-xl border border-white/[0.12] bg-[#0a0c10] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 text-xs text-[#5b6470] font-mono">{title}</span>
      </div>

      <div className="px-4 py-3 font-mono text-[13px] leading-6 min-h-[128px] text-left">
        {visible.map((line, i) => (
          <div
            key={i}
            className={`${variantClass[line.variant ?? "default"]} animate-fade-in`}
          >
            {line.variant === "command" ? `$ ${line.text}` : line.text}
          </div>
        ))}

        <div className="text-white">
          <span className="text-[#39e08a]">$ </span>
          <span className="inline-block w-2 h-4 -mb-0.5 bg-[#39e08a] animate-cursor-blink" />
        </div>
      </div>
    </div>
  );
}

export default AnimatedTerminal;