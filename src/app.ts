import {Hono} from "hono";
import whatsappRoute from "@/routes/whatsapp.route";

const app = new Hono()

app.route("/", whatsappRoute)

export default app