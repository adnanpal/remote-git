import type { User } from "@supabase/supabase-js";

export interface RegisteredDevice {
  device_id: string;
  name: string | null;
  relay_url: string;
  last_seen: string | null;
  created_at: string;
}

interface DeviceDashboardProps {
  user: User;
  devices: RegisteredDevice[];
  loading: boolean;
  error: string;
  onlineDeviceIds: ReadonlySet<string>;
  onScan: () => void;
  onLogout: () => void;
  onSelectDevice: (device: RegisteredDevice) => void;
}

function DeviceDashboard({
  user,
  devices,
  loading,
  error,
  onlineDeviceIds,
  onScan,
  onLogout,
  onSelectDevice,
}: DeviceDashboardProps) {
  const profileName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.user_name ||
    user.email?.split("@")[0] ||
    "Account";
  const initials = String(profileName)
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  const lastSeen = (value: string | null) => {
    if (!value) return "No recent activity";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No recent activity";
    return `Last seen ${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const deviceName = (device: RegisteredDevice) => {
    const savedName = device.name?.trim();
    if (savedName && savedName !== "My Laptop" && savedName !== "My device") {
      return savedName;
    }
    return `Device ${device.device_id.slice(0, 8)}`;
  };

  return (
    <section className="w-full max-w-md sm:max-w-xl md:max-w-3xl mx-auto px-5 sm:px-8 pt-6 md:pt-8 pb-4 animate-fade-in-up">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#39e08a] to-[#1f8f56] text-[#04140b] text-xs font-bold font-mono">
            R
          </span>
          <span className="text-sm font-semibold text-[#eef1f4]">Remote-Git</span>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#39e08a]/25 bg-[#39e08a]/10 text-xs font-semibold text-[#39e08a]">
              {initials || "A"}
            </span>
            <span className="max-w-28 truncate text-sm text-[#c7ccd3] sm:max-w-40">
              {profileName}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-[#aeb6c0] transition-colors hover:border-white/20 hover:text-[#eef1f4]"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[.14em] text-[#39e08a]">
            Your workspace
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#eef1f4] sm:text-3xl">
            Devices
          </h1>
          <p className="mt-2 text-sm text-[#8b95a1]">
            Pair and manage the computers connected to your account.
          </p>
        </div>
        <button
          type="button"
          onClick={onScan}
          className="w-full shrink-0 rounded-xl bg-[#39e08a] px-5 py-3 text-sm font-semibold text-[#04140b] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
        >
          Scan QR code
        </button>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/[0.06] px-4 py-3 text-sm text-[#ff8b8b]" role="alert">
          {error}
        </p>
      )}

      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#c7ccd3]">Paired devices</h2>
          {!loading && (
            <span className="font-mono text-xs text-[#68727e]">
              {devices.length.toString().padStart(2, "0")}
            </span>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-[#8b95a1]">
            Loading your devices...
          </div>
        ) : devices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-9 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#39e08a]/20 bg-[#39e08a]/[0.07] font-mono text-lg text-[#39e08a]">
              +
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#eef1f4]">
              No devices yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8b95a1]">
              Start Remote-Git on your computer, then scan its pairing QR code to add it here.
            </p>
            <button
              type="button"
              onClick={onScan}
              className="mt-5 rounded-xl border border-[#39e08a]/30 bg-[#39e08a]/[0.08] px-4 py-2.5 text-sm font-medium text-[#39e08a] transition-colors hover:bg-[#39e08a]/[0.14]"
            >
              Scan QR code
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.08] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {devices.map((device) => {
              const isConnected = onlineDeviceIds.has(device.device_id);
              return (
                <li
                  key={device.device_id}
                  className="border-white/[0.08]"
                >
                  <button
                    type="button"
                    onClick={() => onSelectDevice(device)}
                    aria-label={`Open ${deviceName(device)}, ${isConnected ? "online" : "offline"}`}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.04] sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#aeb6c0]">
                        <span className="h-4 w-5 rounded-sm border border-current" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#eef1f4]">
                          {deviceName(device)}
                        </p>
                        <p className="mt-1 truncate font-mono text-[11px] text-[#77818d]">
                          {lastSeen(device.last_seen)}
                        </p>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-[#8b95a1]">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-[#39e08a]" : "bg-[#68727e]"}`}
                      />
                      {isConnected ? "Online" : "Offline"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default DeviceDashboard;