import {Hono} from "hono";
import WhatsappHandler from "@/handlers/whatsapp.handler";

const whatsappRoute = new Hono();

whatsappRoute.post("/start", ...WhatsappHandler.start());

export default whatsappRoute;
