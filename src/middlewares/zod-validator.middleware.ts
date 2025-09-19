import { zValidator } from "@hono/zod-validator";
import { ZodSchema } from "zod";

export default function zodValidatorMiddleware<T extends ZodSchema>(
    target: "json" | "form" | "query" | "param",
    schema: T
) {
    return zValidator(target, schema);
}
