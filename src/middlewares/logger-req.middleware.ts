import {createFactory} from "hono/factory";
import logger from "@/lib/logger";

const factory = createFactory();

const loggerReq = factory.createMiddleware(async (c, next) => {
    logger.info("Hello World")
    await next();
})

export default loggerReq;