import errorHandlerMiddleware from "@/middlewares/error-handler.middleware";
import loggerReqMiddleware from "@/middlewares/logger-req.middleware";
import sessionRoute from "@/routes/session.route";
import factory from "@/lib/factory";
import {serveStatic} from "@hono/node-server/serve-static";
import {cors} from "hono/cors";

const app = factory.createApp()

app.use("*", cors())
app.use("*", loggerReqMiddleware)
app.use("/uploads/*", serveStatic({root: "./"}))

app.route("/session", sessionRoute)

app.onError(errorHandlerMiddleware)

export default app