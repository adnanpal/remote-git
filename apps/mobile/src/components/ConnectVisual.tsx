import AnimatedTerminal from "./AnimatedTerminal";

// The phone <-> laptop hero visual from the marketing landing page, reused
// here as an illustrative preview before pairing has actually happened.
function ConnectVisual() {
  return (
    <div className="rg-connect-row">
      <div className="rg-device rg-phone">
        <div className="rg-phone-screen">
          <div className="rg-phone-heading">
            <span>REMOTE-GIT</span>
            <span className="rg-phone-live">&#9679; preview</span>
          </div>
          <div className="rg-phone-file rg-file-mod">src/server/relay.ts</div>
          <div className="rg-phone-file rg-file-mod">src/components/GitPanel.tsx</div>
          <div className="rg-phone-file rg-file-new">src/hooks/useGit.ts</div>
        </div>
      </div>

      <div className="rg-connector" aria-hidden="true" />

      <div className="rg-laptop">
        <div className="rg-terminal">
          <AnimatedTerminal
            title="remote-git — zsh"
            lines={[
              { text: "remote-git start", variant: "command" },
              { text: "✓ Local agent started", variant: "success" },
              { text: "✓ Repository detected", variant: "success" },
              { text: "Waiting for mobile connection…", variant: "muted" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default ConnectVisual;