interface QRScannerProps {
  onCancel: () => void;
  error?: string;
}

function QRScanner({ onCancel, error }: QRScannerProps) {
  return (
    <div className="w-full max-w-md mx-auto px-5 pt-28 pb-14 animate-fade-in-up">
      <div className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-sm shadow-emerald-900/5 p-6">
        <p className="text-xs font-medium tracking-wide text-emerald-700/70 uppercase mb-2">
          Remote Git
        </p>
        <h1 className="text-xl font-semibold text-slate-900 mb-5">
          Scan the pairing QR code
        </h1>

        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-zinc-950 shadow-inner">
          {/* html5-qrcode mounts its video feed into this exact element id */}
          <div id="qr-reader" />
          <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-emerald-400/40" />
        </div>

        <p className="text-sm text-slate-500 mt-4">
          Point your camera at the QR code shown by the Remote Git agent on
          your laptop.
        </p>

        {error && (
          <p className="text-red-500 text-sm mt-3 animate-fade-in" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={onCancel}
          className="mt-6 w-full rounded-xl border border-slate-200 bg-white/60 py-3 text-sm text-slate-600 transition-colors hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default QRScanner;