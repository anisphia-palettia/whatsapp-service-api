import {Hono} from "hono";
import clientRoute from "@/routes/client.route";
import loggerReqMiddleware from "@/middlewares/logger-req.middleware";

const app = new Hono()

app.use("*", loggerReqMiddleware);
app.route("/client", clientRoute)

export default app