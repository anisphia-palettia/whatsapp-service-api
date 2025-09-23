import {createFactory} from "hono/factory";
import envConfig from "@/config/env.config";

const factory = createFactory({
    initApp: (app) => {
        console.log(`Hono run in port ${envConfig.APP_PORT}`);
    }
})

export default factory