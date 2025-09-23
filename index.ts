import "tsconfig-paths/register";
import 'dotenv/config'

import {serve} from "@hono/node-server"
import app from "@/app";
import EnvConfig from "@/config/env.config";

function main() {
    serve({
        fetch: app.fetch,
        port: Number(EnvConfig.APP_PORT),
    })
}

main()