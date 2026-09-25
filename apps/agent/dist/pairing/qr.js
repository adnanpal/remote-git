import QRCode from "qrcode";
export async function generatePairingQR(pairingInfo) {
    return QRCode.toBuffer(JSON.stringify(pairingInfo), {
        type: "png",
        width: 400,
        margin: 2,
    });
}
