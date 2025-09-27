import zodValidatorMiddleware from "@/middlewares/zod-validator.middleware";
import {clientSchema} from "@/schema/client.schema";
import apiResponse from "@/utils/api-response";
import ClientService from "@/services/client.service";
import factory from "@/lib/factory";

export default class ClientHandler {
    private clientService: ClientService;

    constructor(clientService: ClientService) {
        this.clientService = clientService;
    }

    create() {
        return factory.createHandlers(
            zodValidatorMiddleware("json", clientSchema.create),
            async (c) => {
                const validated = c.req.valid("json");
                const client = await this.clientService.create(validated);
                return apiResponse.success(c, "Success create new client", client, 201);
            }
        );
    }

    delete() {
        return factory.createHandlers(
            zodValidatorMiddleware("param", clientSchema.delete),
            async (c) => {
                const validated = c.req.valid("param");
                const client = await this.clientService.deleteById(validated.id);
                return apiResponse.success(c, "Success delete client", client, 200);
            }
        );
    }
}
