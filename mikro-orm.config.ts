import { Migrator } from "@mikro-orm/migrations";
import { defineConfig } from "@mikro-orm/postgresql";
import { $env } from "./env";

module.exports = defineConfig({
	entities: ["./dist/**/*.entity.js"],
	entitiesTs: ["./src/**/*.entity.ts"],
	extensions: [Migrator],
	dbName: $env.DB_NAME,
	user: $env.DB_USER,
	password: $env.DB_PASS,
	logger: console.log.bind(console),
	debug: true,
	migrations: {
		path: "./migrations",
	},
});
