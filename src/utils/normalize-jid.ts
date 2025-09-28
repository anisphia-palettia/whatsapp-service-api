export default function normalizeJid(to: string): string {
    if (to.endsWith("@s.whatsapp.net") || to.endsWith("@g.us")) return to
    if (/^\d+$/.test(to)) return to + "@s.whatsapp.net"
    throw new Error("Number/JID format is not valid")
}