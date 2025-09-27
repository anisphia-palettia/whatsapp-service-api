import {z} from "zod";

export const ClientSchema = {
    paramId : z.object({
        id: z.string()
    })
}