import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import Redis from "ioredis";

declare module "fastify" {
	interface FastifyInstance {
		redis: Redis;
	}
}

const redis: FastifyPluginAsync = async (fastify) => {
	const redis = new Redis({
		username: "",
		password: "password",
		host: "localhost",
		port: 9000,
	});

	redis.on("ready", () => {
		console.log("Redis is ready");
	});

	redis.on("end", () => {
		console.log("Redis connection ended");
	});

	await fastify.decorate("redis", redis);

	fastify.addHook("onRegister", (instance, _done) => {
		instance.redis = redis;
	});

	fastify.addHook("onClose", (_instance, done) => {
		redis.quit().then(() => done());
	});
};

export default fp(redis);
