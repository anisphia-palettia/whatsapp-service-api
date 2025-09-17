import makeWASocket, {useMultiFileAuthState} from "baileys";
import logger from "@/lib/logger";

export const qrCode: Map<string, string> = new Map();

export async function connectWA(clientName: string) {
    const {state, saveCreds} = await useMultiFileAuthState("auth_info")
    const sock = makeWASocket({
        auth: state,
    })

    sock.ev.on("connection.update", (update) => {
        const {connection, lastDisconnect, qr} = update

        if (qr) {
            qrCode.set(clientName, qr)
            logger.info("Qr code updated and stored in map")
        }
    })

}