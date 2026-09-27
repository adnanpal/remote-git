import { useEffect, useRef } from "react";
import "../styles/landing-page.css";
import ConnectVisual from "./ConnectVisual";
import HowItWorksSteps from "./HowItWorks";

interface LandingPageProps {
  onScan: () => void;
  error?: string;
}

function LandingPage({ onScan, error }: LandingPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let revertAnimations: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        const animationContext = gsap.context(() => {
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".rg-nav-inner", { autoAlpha: 0, y: -18, duration: 0.6 })
            .from(
              ".rg-hero-copy > *",
              { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.08 },
              "-=0.25",
            )
            .from(
              ".rg-hero-visual",
              { autoAlpha: 0, y: 26, duration: 0.8 },
              "-=0.35",
            );

          page.querySelectorAll<HTMLElement>(".rg-scroll-reveal").forEach((section) => {
            gsap.from(section, {
              autoAlpha: 0,
              y: 28,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 86%",
                once: true,
              },
            });
          });

          gsap.from(".rg-step", {
            autoAlpha: 0,
            y: 16,
            duration: 0.55,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: ".rg-steps", start: "top 84%", once: true },
          });

          gsap.from(".rg-flow-group", {
            autoAlpha: 0,
            y: 12,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: ".rg-flow", start: "top 88%", once: true },
          });
        }, page);
        revertAnimations = () => animationContext.revert();
      },
    );

    return () => {
      cancelled = true;
      revertAnimations?.();
    };
  }, []);

  return (
    <div className="rg-page" ref={pageRef}>
      <MarketingNav onScan={onScan} />

      <div className="rg-main">
        <header className="rg-wrap rg-hero" id="product">
          <div className="rg-hero-copy">
              <p className="rg-eyebrow">Your git repository. Remotely.</p>
              <h1>
              Control your code.
              <br />
              From anywhere.
            </h1>
            <p className="rg-lead">
              Remote-Git turns your phone into a secure remote control for the
              Git repository running on your laptop.
            </p>
            <div className="rg-actions">
              <button className="rg-button rg-button-primary" onClick={onScan}>
                Connect your repository <span aria-hidden="true">&rarr;</span>
              </button>
              <a className="rg-button rg-button-outline" href="#how">
                How it works
              </a>
            </div>
            {error ? (
              <p className="rg-error" role="alert">{error}</p>
            ) : (
              <div className="rg-status">
                <span className="rg-live-dot" /> Ready to pair with your laptop
              </div>
            )}
          </div>

          <div className="rg-hero-visual">
            <ConnectVisual />
          </div>
        </header>

        <section className="rg-wrap rg-section rg-problem rg-scroll-reveal">
          <p className="rg-eyebrow">The problem</p>
          <h2>Your laptop is powerful.<br />Your phone is always with you.</h2>
          <div className="rg-problem-lines">
            <p>You step away from your desk. <strong>Changes keep happening.</strong></p>
            <p>A build finishes. A branch falls behind. Something needs a look.</p>
            <p>Remote-Git puts the repository <strong>back in your pocket</strong> without leaving your laptop.</p>
          </div>
        </section>

        <section className="rg-wrap rg-section rg-scroll-reveal" id="how">
          <p className="rg-eyebrow">How Remote-Git works</p>
          <h2>Three things happen.</h2>
          <HowItWorksSteps />
        </section>

        <section className="rg-wrap rg-section rg-scroll-reveal" id="git">
          <p className="rg-eyebrow">Every change, right in your hand</p>
          <h2>See what changed.<br />Without opening your laptop.</h2>
          <div className="rg-diff" aria-label="Example Git diff">
            <div className="rg-diff-line rg-diff-context">function connect(pairing: PairingInfo) &#123;</div>
            <div className="rg-diff-line rg-diff-delete">  const relay = createRelay(pairing);</div>
            <div className="rg-diff-line rg-diff-add">  const relay = connectToRelay(pairing, handlers);</div>
            <div className="rg-diff-line rg-diff-context">  return relay;</div>
            <div className="rg-diff-line rg-diff-context">&#125;</div>
          </div>
        </section>

        <section className="rg-wrap rg-section rg-scroll-reveal" id="security">
          <p className="rg-eyebrow">Security</p>
          <h2>Your repository stays yours.</h2>
          <p className="rg-section-intro">
            Remote-Git connects your phone to the agent already running on your
            laptop. Your code is never uploaded anywhere else.
          </p>
          <ul className="rg-security-list">
            <li>Authenticated device pairing</li>
            <li>Encrypted connection</li>
            <li>Local repository access only</li>
            <li>Session-based pairing tokens</li>
          </ul>
          <SecurityFlow />
        </section>

        <section className="rg-section rg-cta rg-scroll-reveal" id="cta">
          <div className="rg-wrap">
            <h2>Your code doesn&apos;t<br />have to stay at your desk.</h2>
            <p>Keep your local Git workflow within reach, wherever you are.</p>
            <div className="rg-actions rg-actions-centered">
              <button className="rg-button rg-button-primary" onClick={onScan}>
                Get started <span aria-hidden="true">&rarr;</span>
              </button>
              <a className="rg-button rg-button-outline" href="#how">See how it works</a>
            </div>
            <div className="rg-tags">BUILT FOR DEVELOPERS <span>·</span> OPEN SOURCE <span>·</span> GIT-NATIVE</div>
          </div>
        </section>
      </div>

      <MarketingFooter />
    </div>
  );
}

function MarketingNav({ onScan }: { onScan: () => void }) {
  return (
    <nav className="rg-nav" aria-label="Main navigation">
      <div className="rg-nav-inner">
        <a className="rg-brand" href="#product">
          <span className="rg-brand-mark">R</span> Remote-Git
        </a>
        <div className="rg-nav-links">
          <a href="#product">Product</a>
          <a href="#how">How it works</a>
          <a href="#git">Git</a>
          <a href="#security">Security</a>
          <a href="#footer">Docs</a>
        </div>
        <button className="rg-nav-cta" onClick={onScan}>Get started</button>
      </div>
    </nav>
  );
}

function SecurityFlow() {
  const stages = ["Pair", "Connect", "Status", "Diff", "Stage", "Commit", "Push"];

  return (
    <div className="rg-flow" aria-label="Git workflow: pair, connect, status, diff, stage, commit, push">
      {stages.map((stage, index) => (
        <div className="rg-flow-group" key={stage}>
          <div className={`rg-flow-step${index === 0 ? " is-active" : ""}`}>
            <span className="rg-flow-dot" />
            <span>{stage}</span>
          </div>
          {index < stages.length - 1 && <span className="rg-flow-line" />}
        </div>
      ))}
    </div>
  );
}

function MarketingFooter() {
  return (
    <footer className="rg-footer" id="footer">
      <div className="rg-wrap">
        <div className="rg-footer-grid">
          <a className="rg-brand" href="#product">
            <span className="rg-brand-mark">R</span> Remote-Git
          </a>
          <div>
            <h3>Product</h3>
            <a href="#how">How it works</a>
            <a href="#git">Git</a>
            <a href="#security">Security</a>
          </div>
          <div>
            <h3>Developers</h3>
            <a href="#how">Documentation</a>
            <a href="#cta">Get started</a>
          </div>
          <div>
            <h3>Project</h3>
            <a href="#product">Remote-Git</a>
          </div>
        </div>
        <div className="rg-footer-bottom">Remote-Git — Control your code remotely.</div>
      </div>
    </footer>
  );
}

export default LandingPage;