import {createFactory} from "hono/factory";
import logger from "@/lib/logger";

const factory = createFactory();

const loggerReqMiddleware = factory.createMiddleware(async (c, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    logger.info(
        {method: c.req.method, url: c.req.url, status: c.res.status, ms},
        'Request handled'
    )
})

export default loggerReqMiddleware;