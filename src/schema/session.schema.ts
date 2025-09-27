import {z} from "zod";

export const SessionSchema = {
    paramId: z.object({
        id: z.string()
    }),
    sendMessage: z.object({
        to: z.string(),
        message: z.string()
    })
}