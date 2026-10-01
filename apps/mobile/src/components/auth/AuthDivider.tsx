function AuthDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-[11px] font-mono text-[#5b6470] uppercase tracking-wider">
        or
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export default AuthDivider;