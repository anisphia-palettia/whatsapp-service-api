import {Hono} from "hono";
import ClientHandler from "@/handlers/client.handler";
import ClientService from "@/services/client.service";
import prismaClient from "@/lib/db";

const clientRoute = new Hono();

const clientService = new ClientService(prismaClient);
const clientHandler = new ClientHandler(clientService);

clientRoute.post("/", ...clientHandler.create());
clientRoute.delete("/:id", ...clientHandler.delete());

export default clientRoute;
