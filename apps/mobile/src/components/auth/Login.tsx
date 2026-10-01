import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import AuthDivider from "./AuthDivider";
import GitHubAuthButton from "./GitHubAuthButton";

interface LoginProps {
  onSuccess?: () => void;
  onSwitchToSignup: () => void;
}

function Login({ onSuccess, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    onSuccess?.();
  };

  const handleGitHub = async () => {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to Remote-Git"
      subtitle="Control your repositories from your phone."
      footer={
        <p className="text-[#8b95a1]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-[#39e08a] font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      }
    >
      <GitHubAuthButton onClick={handleGitHub} disabled={loading} />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="••••••••"
          autoComplete="current-password"
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
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;