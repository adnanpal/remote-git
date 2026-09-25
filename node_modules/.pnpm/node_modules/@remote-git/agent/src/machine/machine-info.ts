import os from 'node:os';

export function getMachineInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    cpu: os.cpus()[0]?.model ?? "Unknown",
    cpuCores: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024),
  };
}