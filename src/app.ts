import errorHandlerMiddleware from "@/middlewares/error-handler.middleware";
import loggerReqMiddleware from "@/middlewares/logger-req.middleware";
import clientRoute from "@/routes/client.route";
import factory from "@/lib/factory";

const app = factory.createApp()

app.use("*", loggerReqMiddleware)
app.route("/client", clientRoute)
app.onError(errorHandlerMiddleware)

export default app