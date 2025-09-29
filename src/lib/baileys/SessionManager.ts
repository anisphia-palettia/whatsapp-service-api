import fs from "fs-extra"
import {WhatsAppSession} from "@/lib/baileys/WhatsappSession"
import {HTTPException} from "hono/http-exception"
import SessionService from "@/services/session.service";
import * as console from "node:console";

export class SessionManager {
    private sessions: Map<string, WhatsAppSession> = new Map()
    private sessionService: SessionService

    constructor(sessionService: SessionService) {
        this.sessionService = sessionService
    }

    async createSession(id: string): Promise<WhatsAppSession> {
        if (this.sessions.has(id)) {
            throw new HTTPException(400, {message: "Session already running"})
        }
        const folder = `./auth/session-${id}`
        await fs.ensureDir(folder)

        const session = new WhatsAppSession(id, folder, this.sessionService, (sessionId) => {
            this.sessions.delete(sessionId)
        })
        await session.start()

        this.sessions.set(id, session)

        return session
    }

    async stopSession(id: string, clearAuth = false) {
        const session = this.sessions.get(id)
        if (!session) throw new HTTPException(404, {message: "Session not running"})

        await session.stop(clearAuth)
        this.sessions.delete(id)
    }

    getSession(id: string) {
        return this.sessions.get(id)
    }

    async listSessions() {
        return this.sessionService.find()
    }

    async restoreAllSessions() {
        const sessions = await this.sessionService.getActiveSessions()
        console.log(sessions)
        for (const {id} of sessions) {
            if (this.sessions.has(id)) continue
            console.log(`[Manager] Restoring session ${id}`)
            const folder = `./auth/session-${id}`
            const session = new WhatsAppSession(id, folder, this.sessionService)
            this.sessions.set(id, session)
            session.start().catch((err) => {
                console.error(`[Manager] Failed to restore ${id}`, err)
                this.sessions.delete(id)
            })
            await new Promise((r) => setTimeout(r, 300))
        }
    }
}
