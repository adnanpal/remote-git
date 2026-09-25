import QRCode from "qrcode";
import type { PairingInfo } from "@remote-git/protocol";

export async function generatePairingQR(
  pairingInfo: PairingInfo
): Promise<Buffer> {
  return QRCode.toBuffer(JSON.stringify(pairingInfo), {
    type: "png",
    width: 400,
    margin: 2,
  });
}