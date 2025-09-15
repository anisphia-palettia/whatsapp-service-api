import {createFactory} from "hono/factory";
import apiResponse from "@/utils/api-response";

const factory = createFactory();

const WhatsappHandler = {
    start() {
        return factory.createHandlers(async (c) => {
            return apiResponse.success(c, "Success start bot", null, 201)
        })
    }
}

export default WhatsappHandler;