// Soft, slow-moving blurred shapes behind the glass UI. Purely decorative —
// pointer-events-none so it never interferes with interaction.
function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50" />

      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-green-200/40 blur-3xl animate-float-slower" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl animate-float-slow" />
    </div>
  );
}

export default BackgroundDecor;