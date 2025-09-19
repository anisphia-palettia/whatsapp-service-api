import {Hono} from "hono";
import ClientHandler from "@/handlers/client.handler";

const clientRoute = new Hono();

clientRoute.post("/", ...ClientHandler.create())
clientRoute.delete("/:id", ...ClientHandler.delete())

export default clientRoute;
