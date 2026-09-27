import { useState } from "react";
import AnimatedTerminal from "./AnimatedTerminal";
import type { TerminalLine } from "./TerminalPanel";

interface Step {
  title: string;
  description: string;
  lines: TerminalLine[];
}

const steps: Step[] = [
  {
    title: "Pair",
    description: "Start the local agent and scan the QR code.",
    lines: [
      { text: "remote-git start", variant: "command" },
      { text: "Repository: ~/Projects/remote-git", variant: "muted" },
      { text: "Branch: main", variant: "muted" },
      { text: "✓ Local agent started", variant: "success" },
      { text: "Scan the QR code on your phone to pair.", variant: "muted" },
    ],
  },
  {
    title: "Connect",
    description: "Authenticate your device and secure the session.",
    lines: [
      { text: "pairing…", variant: "command" },
      { text: "✓ Device authenticated", variant: "success" },
      { text: "✓ Repository connected", variant: "success" },
      { text: "✓ Secure session established", variant: "success" },
    ],
  },
  {
    title: "Control",
    description: "Review status, inspect diffs, and manage Git from your phone.",
    lines: [
      { text: "git status", variant: "command" },
      { text: "On branch main", variant: "muted" },
      { text: "M  src/server/relay.ts", variant: "warning" },
      { text: "M  src/components/GitPanel.tsx", variant: "warning" },
      { text: 'git commit -m "update remote controls"', variant: "command" },
      { text: "✓ Successfully pushed to origin/main", variant: "success" },
    ],
  },
];

function HowItWorksSteps() {
  const [active, setActive] = useState(0);

  return (
    <div className="rg-how">
      <div className="rg-steps">
        {steps.map((step, i) => (
          <button
            key={step.title}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={`rg-step${
              active === i
                ? " is-active"
                : ""
            }`}
          >
            <span className="rg-step-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="rg-step-title">
              {step.title}
            </span>
            <span className="rg-step-description">
              {step.description}
            </span>
          </button>
        ))}
      </div>

      <div className="rg-how-terminal">
        <AnimatedTerminal
          key={active}
          title="adnan@laptop ~/remote-git"
          lines={steps[active].lines}
        />
      </div>
    </div>
  );
}

export default HowItWorksSteps;