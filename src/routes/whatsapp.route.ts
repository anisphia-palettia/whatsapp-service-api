import {Hono} from "hono";

const whatsappRoute = new Hono();

whatsappRoute.post("/start", (c) => {
    return c.json({
        success: true
      }, 201)
})

export default whatsappRoute