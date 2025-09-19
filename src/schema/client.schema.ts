import {z} from "zod";

export const clientSchema = {
    create: z.object({
        name: z.string().min(1).trim(),
    }),
    delete: z.object({
        id: z.string().min(1),
    }),
}

export type ClientCreatePayload = z.infer<typeof clientSchema.create>
export type ClientDeletePayload = z.infer<typeof clientSchema.delete>
