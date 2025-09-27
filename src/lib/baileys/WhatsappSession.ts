import makeWASocket, {
    WASocket,
    useMultiFileAuthState
} from "baileys"

export class WhatsAppSession {
    id: string
    folder: string
    sock!: WASocket
    connected = false
    lastQr: string | null = null

    constructor(id: string, folder: string) {
        this.id = id
        this.folder = folder
    }

    async start(): Promise<void> {
        const {state, saveCreds} = await useMultiFileAuthState(this.folder)

        this.sock = makeWASocket({
            auth: state,
        })

        this.sock.ev.on("creds.update", saveCreds)

        this.sock.ev.on("connection.update", (update) => {
            const {connection, qr} = update
            if (qr) {
                this.lastQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    qr
                )}`
                console.log(`[${this.id}] QR tersedia di: ${this.lastQr}`)
            }
            if (connection === "open") {
                this.connected = true
                console.log(`[${this.id}] Connected`)
            } else if (connection === "close") {
                this.connected = false
                console.log(`[${this.id}] Disconnected`)
            }
        })

        this.sock.ev.on("messages.upsert", (m) => {
            console.log(`[${this.id}] Pesan baru:`, JSON.stringify(m, null, 2))
        })
    }

    async stop(): Promise<void> {
        if (!this.sock) return
        await this.sock.logout().catch(() => {
        })
        this.connected = false
        console.log(`[${this.id}] Stopped`)
    }

    async sendMessage(to: string, text: string) {
        if (!this.sock) throw new Error("Socket belum aktif")
        if (!this.connected) throw new Error("Belum connect ke WhatsApp")
        return await this.sock.sendMessage(to, {text})
    }
}
