import { Migrator } from "@mikro-orm/migrations"
import { defineConfig } from "@mikro-orm/postgresql"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { $env } from "./env"

module.exports = defineConfig({
	entities: ["./src/**/*.entity.js"],
	entitiesTs: ["./src/**/*.entity.ts"],
	tsNode: true,
	metadataProvider: TsMorphMetadataProvider,
	extensions: [Migrator],
	dbName: $env.DB_NAME,
	user: $env.DB_USER,
	password: $env.DB_PASS,
	logger: console.log.bind(console),
	debug: true,
	migrations: {
		path: "./migrations",
	},
})
