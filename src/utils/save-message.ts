import {proto, getContentType} from "baileys"
import extractMessageText from "@/utils/extract-message-text";
import prismaClient from "@/lib/db";
import saveMediaToFile from "@/utils/save-media-to-file";
import * as console from "node:console";

export default async function saveMessage(
    msg: proto.IWebMessageInfo,
    sessionId: string
) {
    if (!msg.message) {
        console.log("Skip pesan tanpa content:", msg.key.id)
        return
    }

    const waId = msg.key.id!
    const chatId = msg.key.remoteJid!
    const senderId = msg.key.participant || msg.key.remoteJid!
    const fromMe = msg.key.fromMe || false
    const timestamp = new Date(Number(msg.messageTimestamp) * 1000)

    const contentType = getContentType(msg.message) ?? "unknown"

    if (contentType === "protocolMessage") {
        console.log("⏩ Skip protocolMessage:", msg.key.id)
        return
    } else if (contentType === "unknown") {
        console.log("⏩ Skip unknown:", msg.key.id)
        return
    }

    const textMessage = extractMessageText(msg)

    let mediaUrl: string | undefined
    let mediaType: string | undefined
    let mediaSize: number | undefined

    try {
        if (
            msg.message.imageMessage ||
            msg.message.videoMessage ||
            msg.message.audioMessage ||
            msg.message.documentMessage
        ) {
            const {filePath, fileSize, mediaType: mType} = await saveMediaToFile(msg.message, waId)
            mediaUrl = filePath
            mediaType = mType
            mediaSize = fileSize
        }
    } catch (err) {
        console.error("❌ Gagal simpan media:", err)
    }

    const chat = await prismaClient.chat.findUnique({where: {chatId}})
    console.log("MESSAGE", msg)
    if (!chat) {
        await prismaClient.chat.create({
            data: {
                chatId,
                waId,
                name: chatId.endsWith("@g.us") ? "Unknown Group" : "Private Chat",
                isGroup: chatId.endsWith("@g.us"),
                sessionId,
            },
        })
    }

    await prismaClient.chatMessage.create({
        data: {
            chatId,
            senderId,
            fromMe,
            timestamp,
            type: contentType,
            message: textMessage,
            mediaUrl,
            mediaType,
            mediaSize,
            sessionId,
        },
    })

    console.log("✅ Success save message", waId, textMessage || mediaType || contentType)
}
