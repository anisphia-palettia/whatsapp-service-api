import * as process from "node:process";

const EnvConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_PORT: process.env.APP_PORT || 3000,
}

export default EnvConfig