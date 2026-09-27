interface QRScannerProps {
  onCancel: () => void;
  error?: string;
}

function QRScanner({ onCancel, error }: QRScannerProps) {
  return (
    <div className="w-full max-w-md sm:max-w-xl mx-auto px-5 sm:px-8 pt-28 md:pt-32 pb-14 animate-fade-in-up">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
        <p className="text-xs font-medium tracking-[.14em] text-[#39e08a] uppercase mb-2 font-mono">
          Remote-Git
        </p>
        <h1 className="text-xl font-semibold text-[#eef1f4] mb-5">
          Scan the pairing QR code
        </h1>

        <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0a0c10] shadow-inner">
          {/* html5-qrcode mounts its video feed into this exact element id */}
          <div id="qr-reader" />
          <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-[#39e08a]/40" />
        </div>

        <p className="text-sm text-[#8b95a1] mt-4">
          Point your camera at the QR code shown by the Remote-Git agent on
          your laptop.
        </p>

        {error && (
          <p className="text-[#ff6b6b] text-sm mt-3 animate-fade-in" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={onCancel}
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm text-[#c7ccd3] transition-colors hover:bg-white/[0.06]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default QRScanner;