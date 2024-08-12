import { cleanEnv, port, str } from "envalid"

export const $env = cleanEnv(process.env, {
	PORT: port(),
	DB_NAME: str(),
	DB_USER: str(),
	DB_PASS: str(),
	DB_PORT: str(),
})

// $env.isProduction // true if NODE_ENV === 'production'
// $env.isTest // true if NODE_ENV === 'test'
// $env.isDev // true if NODE_ENV === 'development'
