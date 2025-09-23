import zodValidatorMiddleware from "@/middlewares/zod-validator.middleware";
import {clientSchema} from "@/schema/client.schema";
import apiResponse from "@/utils/api-response";
import ClientService from "@/services/client.service";
import factory from "@/lib/factory";

const ClientHandler = {
    create() {
        return factory.createHandlers(zodValidatorMiddleware("json", clientSchema.create), async (c) => {
            const validated = c.req.valid("json")
            const client = await ClientService.create(validated)
            return apiResponse.success(c, "Success create new client", client, 201)
        })
    },
    delete() {
        return factory.createHandlers(zodValidatorMiddleware("param", clientSchema.delete), async (c) => {
            const validated = c.req.valid("param")
            const client = await ClientService.deleteById(Number(validated.id))
            return apiResponse.success(c, "Success delete client", client, 200)
        })
    }
}

export default ClientHandler;