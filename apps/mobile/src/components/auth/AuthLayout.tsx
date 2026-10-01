import type { ReactNode } from "react";
import BackgroundDecor from "../Backgounddecor";
import Reveal from "../Reveal";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

// Shared chrome for Login/Signup — same grid+glow background and glass
// card treatment as the rest of the app.
function AuthLayout({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#05070a] text-[#eef1f4]">
      <BackgroundDecor />

      <div className="min-h-screen flex items-center justify-center px-5 py-14">
        <Reveal className="w-full max-w-sm sm:max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#39e08a] to-[#1f8f56] text-[#04140b] text-xs font-bold font-mono">
              R
            </span>
            <span className="text-sm font-semibold text-[#eef1f4]">
              Remote-Git
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8">
            <p className="text-xs font-medium tracking-[.14em] text-[#39e08a] uppercase mb-2 font-mono">
              {eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#eef1f4] tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-[#8b95a1] mt-2">{subtitle}</p>

            <div className="mt-6">{children}</div>
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm">{footer}</div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

export default AuthLayout;