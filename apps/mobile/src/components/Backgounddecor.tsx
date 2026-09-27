// Same dark grid + top glow used on the Remote-Git landing page.
// Fixed and pointer-events-none so it never interferes with interaction.
function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#05070a]"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.09) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute -top-[20vw] left-1/2 h-[60vw] w-[60vw] max-h-[900px] max-w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(57,224,138,.14), transparent 65%)",
        }}
      />
    </div>
  );
}

export default BackgroundDecor;