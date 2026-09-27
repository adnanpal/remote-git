import type { ReactNode } from "react";

interface InstructionStep {
  step: number;
  title: string;
  description: ReactNode;
}

const steps: InstructionStep[] = [
  {
    step: 1,
    title: "Run the agent",
    description: (
      <>
        Open a terminal on your computer and run{" "}
        <code className="rounded-md bg-white/[0.06] border border-white/10 px-1.5 py-0.5 font-mono text-xs text-[#39e08a]">
          npx remote-git
        </code>
        .
      </>
    ),
  },
  {
    step: 2,
    title: "Wait for the QR code",
    description: "The agent starts and displays a pairing QR code.",
  },
  {
    step: 3,
    title: "Open Remote-Git on your phone",
    description: "Open this web app in your phone's browser.",
  },
  {
    step: 4,
    title: "Scan the QR code",
    description: "Tap \u201cScan QR Code\u201d and point your camera at the QR shown on your laptop.",
  },
  {
    step: 5,
    title: "Manage your repositories",
    description:
      "Once connected, your approved workspaces and Git repositories appear here.",
  },
];

function Instructions() {
  return (
    <section
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 animate-fade-in-up"
      style={{ animationDelay: "260ms" }}
    >
      <p className="text-xs font-medium tracking-[.14em] text-[#39e08a] uppercase mb-4 font-mono">
        How to use Remote-Git
      </p>

      <ol className="space-y-4">
        {steps.map(({ step, title, description }) => (
          <li key={step} className="flex gap-3">
            <span className="flex-none mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#39e08a]/10 text-[11px] font-mono text-[#39e08a]">
              {step}
            </span>
            <div>
              <p className="text-sm text-[#eef1f4]">{title}</p>
              <p className="text-sm text-[#8b95a1] mt-0.5">{description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-xs text-[#5b6470] leading-relaxed">
        Your Git repositories stay on your computer. Remote-Git talks to the
        local agent on your laptop instead of uploading your repositories
        anywhere.
      </p>
    </section>
  );
}

export default Instructions;