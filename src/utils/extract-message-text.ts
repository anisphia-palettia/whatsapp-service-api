import {proto} from "baileys"

export default function extractMessageText(msg: proto.IWebMessageInfo): string | null {
    if (!msg.message) return null;

    if (msg.message.conversation) return msg.message.conversation;
    if (msg.message.extendedTextMessage?.text) return msg.message.extendedTextMessage.text;
    if (msg.message.ephemeralMessage?.message?.conversation) {
        return msg.message.ephemeralMessage.message.conversation;
    }
    if (msg.message.ephemeralMessage?.message?.extendedTextMessage?.text) {
        return msg.message.ephemeralMessage.message.extendedTextMessage.text;
    }
    if (msg.message.imageMessage?.caption) return msg.message.imageMessage.caption;
    if (msg.message.videoMessage?.caption) return msg.message.videoMessage.caption;
    if (msg.message.documentMessage?.caption) return msg.message.documentMessage.caption;

    return null;
}
