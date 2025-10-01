import {downloadContentFromMessage, proto} from "baileys";
import {HTTPException} from "hono/http-exception";
import * as path from "node:path";
import fs from "fs-extra";

export default async function saveMediaToFile(message: proto.IMessage, waId: string): Promise<{
    filePath: string,
    fileSize?: number,
    mediaType: string
}> {
    let type: "image" | "video" | "audio" | "document" | null = null
    let stream

    if (message.imageMessage) {
        type = "image"
        stream = await downloadContentFromMessage(message.imageMessage, "image")
    } else if (message.videoMessage) {
        type = "video"
        stream = await downloadContentFromMessage(message.videoMessage, "video")
    } else if (message.audioMessage) {
        type = "audio"
        stream = await downloadContentFromMessage(message.audioMessage, "audio")
    } else if (message.documentMessage) {
        type = "document"
        stream = await downloadContentFromMessage(message.documentMessage, "document")
    }

    if (!stream || !type) throw new HTTPException(400, {message: "Unsupported media type"})

    const folder = path.join(process.cwd(), "public", type)
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})

    const filename = `${waId}-${Date.now()}.png`
    const filePath = path.join(filename)

    let buffer = Buffer.from([])
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    fs.writeFileSync(filePath, buffer)

    return {filePath, fileSize: buffer.length, mediaType: type}
}