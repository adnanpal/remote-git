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
        <code className="rounded-md bg-emerald-900/5 border border-emerald-900/10 px-1.5 py-0.5 font-mono text-xs text-emerald-800">
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
    title: "Open Remote Git on your phone",
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
      className="mt-6 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 p-6 animate-fade-in-up"
      style={{ animationDelay: "260ms" }}
    >
      <p className="text-xs font-medium tracking-wide text-emerald-700/70 uppercase mb-4">
        How to use Remote Git
      </p>

      <ol className="space-y-4">
        {steps.map(({ step, title, description }) => (
          <li key={step} className="flex gap-3">
            <span className="flex-none mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-mono text-emerald-700">
              {step}
            </span>
            <div>
              <p className="text-sm text-slate-800">{title}</p>
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-xs text-slate-500 leading-relaxed">
        Your Git repositories stay on your computer. Remote Git talks to the
        local agent on your laptop instead of uploading your repositories
        anywhere.
      </p>
    </section>
  );
}

export default Instructions;