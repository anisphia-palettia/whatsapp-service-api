import makeWASocket, {
    WASocket,
    useMultiFileAuthState,
    DisconnectReason
} from "baileys"
import {Boom} from "@hapi/boom"
import fs from "fs-extra"
import prismaClient from "@/lib/db";
import SessionService from "@/services/session.service";
import sessionRoute from "@/routes/session.route";

export class WhatsAppSession {
    id: string
    folder: string
    sock?: WASocket
    connected = false
    lastQr: string | null = null
    qrTimeout?: NodeJS.Timeout
    stopping = false
    sessionService: SessionService

    constructor(
        id: string,
        folder: string,
        sessionService: SessionService,
        private onLogout?: (id: string) => void
    ) {
        this.id = id
        this.folder = folder
        this.sessionService = sessionService
    }

    async start(): Promise<void> {
        if (this.sock) {
            console.log(`[${this.id}] Socket already running, skip start`)
            return
        }

        const {state, saveCreds} = await useMultiFileAuthState(this.folder)

        this.sock = makeWASocket({auth: state})

        this.sock.ev.on("creds.update", async () => {
            await saveCreds()
            await this.sessionService.update(this.id, {isActive: true})
        })

        this.sock.ev.on("connection.update", async (update) => {
            const {connection, qr, lastDisconnect} = update

            if (qr) {
                this.lastQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    qr
                )}`
                console.log(`[${this.id}] QR tersedia di: ${this.lastQr}`)

                if (this.qrTimeout) clearTimeout(this.qrTimeout)
                this.qrTimeout = setTimeout(async () => {
                    if (!this.connected) {
                        console.log(
                            `[${this.id}] QR tidak discan dalam 3 menit, hapus session`
                        )
                        await this.stop(true)
                        this.onLogout?.(this.id)
                    }
                }, 3 * 60 * 1000) // 3 menit
            }

            // === Handle connection open ===
            if (connection === "open") {
                this.connected = true
                this.lastQr = null
                if (this.qrTimeout) {
                    clearTimeout(this.qrTimeout)
                    this.qrTimeout = undefined
                }
                console.log(`[${this.id}] Connected`)
            }

            // === Handle connection close ===
            else if (connection === "close") {
                if (this.stopping) {
                    console.log(`[${this.id}] Close ignored, because stopping`)
                    return
                }

                this.connected = false
                const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode

                if (statusCode === DisconnectReason.loggedOut) {
                    console.log(`[${this.id}] Logged out from device`)
                    await this.stop(true)
                    this.onLogout?.(this.id)
                    return
                }

                console.log(`[${this.id}] Disconnected, try reconnect`)
                await this.stop()
                await this.start()
            }
        })

        this.sock.ev.on("messages.upsert", (m) => {
            // handle pesan masuk di sini kalau mau
            // console.log(`[${this.id}] Pesan baru:`, JSON.stringify(m, null, 2))
        })
    }

    async stop(clearAuth = false): Promise<void> {
        await this.sessionService.update(this.id, {isActive: false})
        this.stopping = true

        if (this.sock) {
            try {
                this.sock.ev.removeAllListeners("connection.update")
                this.sock.ev.removeAllListeners("messages.upsert")
                this.sock.ev.removeAllListeners("creds.update")
                await this.sock.end(new Error("Manual stop"))
            } catch {
                await this.sock.logout().catch(() => {
                })
            }
            this.sock = undefined
        }

        this.connected = false
        this.lastQr = null

        if (this.qrTimeout) {
            clearTimeout(this.qrTimeout)
            this.qrTimeout = undefined
        }

        if (clearAuth) {
            await fs.remove(this.folder)
        }

        console.log(`[${this.id}] Stopped`)
        this.stopping = false
    }

    async sendMessage(to: string, text: string) {
        if (!this.sock) throw new Error("Socket belum aktif")
        if (!this.connected) throw new Error("Belum connect ke WhatsApp")
        return await this.sock.sendMessage(to, {text}, {statusJidList: []})
    }
}
