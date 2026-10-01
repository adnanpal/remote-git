import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

function AuthInput({ label, id, ...props }: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-mono text-[#8b95a1] mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-lg border border-white/10 bg-[#0a0c10] px-3.5 py-2.5 text-sm text-[#eef1f4] placeholder:text-[#5b6470] outline-none transition-colors focus:border-[#39e08a]/50 focus:ring-2 focus:ring-[#39e08a]/20"
      />
    </div>
  );
}

export default AuthInput;