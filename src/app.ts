import errorHandlerMiddleware from "@/middlewares/error-handler.middleware";
import loggerReqMiddleware from "@/middlewares/logger-req.middleware";
import sessionRoute from "@/routes/session.route";
import factory from "@/lib/factory";

const app = factory.createApp()

app.use("*", loggerReqMiddleware)
app.route("/client", sessionRoute)
app.onError(errorHandlerMiddleware)

export default app