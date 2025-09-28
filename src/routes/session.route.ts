import {Hono} from "hono";
import SessionHandler from "@/handlers/session.handler";
import SessionService from "@/services/session.service";
import prismaClient from "@/lib/db";
import {SessionManager} from "@/lib/baileys/SessionManager";

const sessionRoute = new Hono();

const sessionManager = new SessionManager();
const sessionService = new SessionService(prismaClient);

const sessionHandler = new SessionHandler(sessionService, sessionManager);

sessionRoute.post("/", ...sessionHandler.create());
sessionRoute.delete("/:id", ...sessionHandler.delete());
sessionRoute.post("/:id/start", ...sessionHandler.start())

sessionRoute.get("/:id/qr", ...sessionHandler.qr())
sessionRoute.post("/:id/send", ...sessionHandler.sendMessage())

export default sessionRoute;
