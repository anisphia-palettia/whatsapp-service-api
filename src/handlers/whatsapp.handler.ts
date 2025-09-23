import apiResponse from "@/utils/api-response";
import factory from "@/lib/factory";


const WhatsappHandler = {
    start() {
        return factory.createHandlers(async (c) => {
            return apiResponse.success(c, "Success start bot", null, 201)
        })
    }
}

export default WhatsappHandler;