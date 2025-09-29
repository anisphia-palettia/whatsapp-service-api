import {Hono} from "hono";
import SessionHandler from "@/handlers/session.handler";
import SessionService from "@/services/session.service";
import prismaClient from "@/lib/db";
import {SessionManager} from "@/lib/baileys/SessionManager";

const sessionRoute = new Hono()

const sessionService = new SessionService(prismaClient);
const sessionManager = new SessionManager(sessionService);

const sessionHandler = new SessionHandler(sessionService, sessionManager);

sessionRoute.post("/", ...sessionHandler.create());
sessionRoute.post("/restore", ...sessionHandler.restoreSession())
sessionRoute.delete("/:id", ...sessionHandler.delete());

const waRoute = new Hono().basePath("/wa");

waRoute.post("/:id/start", ...sessionHandler.start())
waRoute.post("/:id/stop", ...sessionHandler.stop())
waRoute.get("/:id/qr", ...sessionHandler.qr())
waRoute.post("/:id/send", ...sessionHandler.sendMessage())
waRoute.get("/:id/groups", ...sessionHandler.getAllGroups())

sessionRoute.route("/", waRoute)

export default sessionRoute;
