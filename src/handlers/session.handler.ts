import zodValidatorMiddleware from "@/middlewares/zod-validator.middleware";
import apiResponse from "@/utils/api-response";
import SessionService from "@/services/session.service";
import factory from "@/lib/factory";
import {
    SessionCreateInputSchema, SessionDeleteArgsSchema
} from "@/generated/zod";
import {SessionSchema} from "@/schema/session.schema";
import {SessionManager} from "@/lib/baileys/SessionManager";
import assertFound from "@/utils/assert-found";

export default class SessionHandler {
    private sessionService: SessionService;
    private manager: SessionManager

    constructor(clientService: SessionService, manager: SessionManager) {
        this.sessionService = clientService;
        this.manager = manager;
    }

    create() {
        return factory.createHandlers(
            zodValidatorMiddleware("json", SessionCreateInputSchema),
            async (c) => {
                const validated = c.req.valid("json");
                const client = await this.sessionService.create(validated);
                return apiResponse.success(c, "Success create new client", client, 201);
            }
        );
    }

    delete() {
        return factory.createHandlers(
            zodValidatorMiddleware("param", SessionDeleteArgsSchema),
            async (c) => {
                const validated = c.req.valid("param");
                const client = await this.sessionService.deleteById(validated.where.id);
                return apiResponse.success(c, "Success delete client", client, 200);
            }
        );
    }

    start() {
        return factory.createHandlers(zodValidatorMiddleware("param", SessionSchema.paramId), async (c) => {
            const {id} = c.req.valid("param")
            assertFound(await this.sessionService.findById(id), `Session ${id} not found`)
            const s = await this.manager.createSession(id)
            await this.sessionService.update(id, {isActive: true})
            return apiResponse.success(c, `Success start session ${s.id}`)
        })
    }


}
