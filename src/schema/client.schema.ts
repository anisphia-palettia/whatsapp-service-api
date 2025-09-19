import {z} from "zod";

export const clientSchema = {
    create: z.object({
        name: z.string().min(1),
    })
}

export type ClientCreatePayload = z.infer<typeof clientSchema.create>