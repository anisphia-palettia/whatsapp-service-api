import {createFactory} from "hono/factory";

const factory = createFactory();

const clientHandler = {
    create() {
        return factory.createHandlers(async (c) => {

        })
    }
}