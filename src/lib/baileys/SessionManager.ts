import fs from "fs-extra"
import {WhatsAppSession} from "@/lib/baileys/WhatsappSession";

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
            throw new Error("Session already running")
        }
        const folder = `./auth/session-${id}`
        await fs.ensureDir(folder)
        const session = new WhatsAppSession(id, folder)
        await session.start()
        this.sessions.set(id, session)
        this.meta[id] = { folder }
        await this.saveMeta()
        return session
    }

    async stopSession(id: string) {
        const session = this.sessions.get(id)
        if (!session) throw new Error("Session not running")
        await session.stop()
        this.sessions.delete(id)
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
                connected: s?.connected || false
            }
        })
    }

    async restoreAllSessions() {
        for (const id of Object.keys(this.meta)) {
            console.log(`Restoring session ${id}`)
            await this.createSession(id)
            await new Promise((r) => setTimeout(r, 300))
        }
    }
}
