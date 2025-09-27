import {WhatsAppSession} from "@/lib/baileys/WhatsappSession";
import factory from "@/lib/factory";
import zodValidatorMiddleware from "@/middlewares/zod-validator.middleware";
import {SessionSchema} from "@/schema/session.schema";

export default class WhatsappHandler {
    private whatsapp: WhatsAppSession

    constructor(whatsapp: WhatsAppSession) {
        this.whatsapp = whatsapp
    }

    sendMessage() {
        return factory.createHandlers(zodValidatorMiddleware("json", SessionSchema.sendMessage))
    }
}