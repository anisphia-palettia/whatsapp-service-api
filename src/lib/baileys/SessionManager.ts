import fs from "fs-extra"
import { WhatsAppSession } from "@/lib/baileys/WhatsappSession"
import { HTTPException } from "hono/http-exception"

export class SessionManager {
    private sessions: Map<string, WhatsAppSession> = new Map()
    private metaFile = "./sessions.json"
    private meta: Record<string, { folder: string }> = {}

    constructor() {}

    async loadMeta() {
        await fs.ensureFile(this.metaFile)
        this.meta = await fs.readJson(this.metaFile).catch(() => ({}))
    }

    private async saveMeta() {
        await fs.writeJson(this.metaFile, this.meta, { spaces: 2 })
    }

    async createSession(id: string): Promise<WhatsAppSession> {
        if (this.sessions.has(id)) {
            throw new HTTPException(400, { message: "Session already running" })
        }
        const folder = `./auth/session-${id}`
        await fs.ensureDir(folder)

        const session = new WhatsAppSession(id, folder, (sessionId) => {
            this.sessions.delete(sessionId)
            delete this.meta[sessionId]
            this.saveMeta()
        })
        await session.start()

        this.sessions.set(id, session)
        this.meta[id] = { folder }
        await this.saveMeta()

        return session
    }

    async stopSession(id: string, clearAuth = false) {
        const session = this.sessions.get(id)
        if (!session) throw new HTTPException(404, { message: "Session not running" })

        await session.stop(clearAuth)
        this.sessions.delete(id)

        if (clearAuth) {
            delete this.meta[id]
            await this.saveMeta()
        }
    }

    getSession(id: string) {
        return this.sessions.get(id)
    }

    listSessions() {
        return Object.keys(this.meta).map((id) => {
            const s = this.sessions.get(id)
            return {
                id,
                folder: this.meta[id].folder,
                running: !!s,
                connected: s?.connected || false,
            }
        })
    }

    async restoreAllSessions() {
        for (const id of Object.keys(this.meta)) {
            if (this.sessions.has(id)) continue // skip yang sudah jalan
            console.log(`[Manager] Restoring session ${id}`)
            const folder = this.meta[id].folder
            const session = new WhatsAppSession(id, folder)
            this.sessions.set(id, session)
            session.start().catch((err) => {
                console.error(`[Manager] Failed to restore ${id}`, err)
                this.sessions.delete(id)
            })
            await new Promise((r) => setTimeout(r, 300))
        }
    }
}
