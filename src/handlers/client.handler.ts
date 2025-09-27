import zodValidatorMiddleware from "@/middlewares/zod-validator.middleware";
import apiResponse from "@/utils/api-response";
import ClientService from "@/services/client.service";
import factory from "@/lib/factory";
import {
    ClientCreateInputSchema, ClientDeleteArgsSchema
} from "@/generated/zod";
import {ClientSchema} from "@/schema/client.schema";
import {SessionManager} from "@/lib/baileys/SessionManager";

export default class ClientHandler {
    private clientService: ClientService;
    private manager: SessionManager

    constructor(clientService: ClientService, manager: SessionManager) {
        this.clientService = clientService;
        this.manager = manager;
    }

    create() {
        return factory.createHandlers(
            zodValidatorMiddleware("json", ClientCreateInputSchema),
            async (c) => {
                const validated = c.req.valid("json");
                const client = await this.clientService.create(validated);
                return apiResponse.success(c, "Success create new client", client, 201);
            }
        );
    }

    delete() {
        return factory.createHandlers(
            zodValidatorMiddleware("param", ClientDeleteArgsSchema),
            async (c) => {
                const validated = c.req.valid("param");
                const client = await this.clientService.deleteById(validated.where.id);
                return apiResponse.success(c, "Success delete client", client, 200);
            }
        );
    }

    start() {
        return factory.createHandlers(zodValidatorMiddleware("param", ClientSchema.paramId), async (c) => {
            const {id} = c.req.valid("param")
            const s = await this.manager.createSession(id)
            return apiResponse.success(c, `Success start client ${s.id}`)
        })
    }
}
