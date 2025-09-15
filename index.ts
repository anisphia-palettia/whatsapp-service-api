import "tsconfig-paths/register";
import 'dotenv/config'

import {serve} from "@hono/node-server"
import app from "@/app";
import * as console from "node:console";
import EnvConfig from "@/config/env.config";

function main() {
    console.log(`App started at port ${EnvConfig.APP_PORT}`)
    serve({
        fetch: app.fetch,
        port: Number(EnvConfig.APP_PORT),
    })
}

main()