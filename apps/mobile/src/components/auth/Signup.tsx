import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import AuthDivider from "./AuthDivider";
import GitHubAuthButton from "./GitHubAuthButton";

interface SignupProps {
  onSwitchToLogin: () => void;
}

function Signup({ onSwitchToLogin }: SignupProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSent(true);
  };

  const handleGitHub = async () => {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) setError(oauthError.message);
  };

  if (sent) {
    return (
      <AuthLayout
        eyebrow="Almost there"
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}.`}
        footer={
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#39e08a] font-medium hover:underline"
          >
            Back to log in
          </button>
        }
      >
        <div className="flex items-center gap-2 text-sm text-[#8b95a1]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39e08a] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#39e08a]" />
          </span>
          Confirm your email to activate your account.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Create your account"
      title="Get started with Remote-Git"
      subtitle="Pair your phone with your laptop in a minute."
      footer={
        <p className="text-[#8b95a1]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#39e08a] font-medium hover:underline"
          >
            Log in
          </button>
        </p>
      }
    >
      <GitHubAuthButton onClick={handleGitHub} disabled={loading} label="Sign up with GitHub" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="fullName"
          label="Full name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ada Lovelace"
          autoComplete="name"
          required
        />
        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          minLength={6}
          required
        />
        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-[#ff6b6b] text-sm" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#39e08a] text-[#04140b] py-3 font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;