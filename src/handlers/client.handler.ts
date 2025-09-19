import {createFactory} from "hono/factory";
import zodValidatorMiddleware from "@/middlewares/zod-validator.middleware";
import {ClientCreatePayload, clientSchema} from "@/schema/client.schema";
import apiResponse from "@/utils/api-response";

const factory = createFactory();

const ClientHandler = {
    create() {
        return factory.createHandlers(zodValidatorMiddleware("json", clientSchema.create), async (c) => {
            const req = c.req.valid("json") as ClientCreatePayload
            return apiResponse.success(c, "Success create new client", req, 201)
        })
    }
}

export default ClientHandler;