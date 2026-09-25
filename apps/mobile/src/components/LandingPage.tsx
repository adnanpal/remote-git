import Instructions from "./Instructions";

interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

const howItWorks: HowItWorksStep[] = [
  {
    step: "01",
    title: "Run Remote Git",
    description: "Run npx remote-git on your laptop.",
  },
  {
    step: "02",
    title: "Scan the QR code",
    description:
      "The agent generates a pairing QR code. Open this site on your phone and scan it.",
  },
  {
    step: "03",
    title: "Choose a repository",
    description:
      "After pairing, pick one of your approved workspaces and repositories.",
  },
  {
    step: "04",
    title: "Manage Git",
    description: "Inspect repository status from your phone.",
  },
];

interface LandingPageProps {
  onScan: () => void;
  error?: string;
}

function LandingPage({ onScan, error }: LandingPageProps) {
  return (
    <div className="w-full max-w-md mx-auto px-5 pt-28 pb-14">
      {/* Hero */}
      <div
        className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 p-6 animate-fade-in-up"
        style={{ animationDelay: "60ms" }}
      >
        <p className="text-xs font-medium tracking-wide text-emerald-700/70 uppercase mb-3">
          Remote Git
        </p>

        <h1 className="text-3xl font-semibold text-slate-900 leading-tight">
          Control your local Git repositories from your phone.
        </h1>

        <p className="text-slate-600 mt-4 leading-relaxed">
          Remote Git pairs your phone with the Remote Git agent running on
          your laptop, so you can check repository status without sitting
          down at your desk.
        </p>

        <button
          onClick={onScan}
          className="group mt-7 w-full rounded-xl bg-emerald-600 text-white py-3.5 font-medium shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="inline-flex items-center gap-2">
            Scan QR Code
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </span>
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3 animate-fade-in" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* How it works */}
      <section
        className="mt-6 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 p-6 animate-fade-in-up"
        style={{ animationDelay: "160ms" }}
      >
        <p className="text-xs font-medium tracking-wide text-emerald-700/70 uppercase mb-4">
          How it works
        </p>

        <ol className="space-y-6">
          {howItWorks.map(({ step, title, description }) => (
            <li key={step} className="flex gap-4">
              <span className="flex-none font-mono text-sm text-emerald-500/70 w-6 pt-0.5">
                {step}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{title}</p>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Instructions />

      <footer
        className="mt-10 pb-2 text-center animate-fade-in-up"
        style={{ animationDelay: "340ms" }}
      >
        <p className="text-xs text-slate-400">Built by Adnan</p>
      </footer>
    </div>
  );
}

export default LandingPage;