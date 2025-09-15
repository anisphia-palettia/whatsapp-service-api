import {Hono} from "hono";
import whatsappRoute from "@/routes/whatsapp.route";
import loggerReqMiddleware from "@/middlewares/logger-req.middleware";

const app = new Hono()

app.use("*", loggerReqMiddleware);
app.route("/", whatsappRoute)

export default app