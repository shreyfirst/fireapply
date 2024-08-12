import { type EntityManager, MikroORM } from "@mikro-orm/postgresql";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyRequest {
		em: EntityManager;
	}
}

const mikrorm: FastifyPluginAsync = async (fastify) => {
	const orm = await MikroORM.init();

	await fastify.decorate("em", orm.em.fork({ freshEventManager: true }));

	await fastify.addHook("onRequest", (request, _reply, done) => {
		request.em = orm.em.fork({ freshEventManager: true });
		done();
	});

	// shut down the connection when closing the app
	await fastify.addHook("onClose", async () => {
		await orm.close();
	});
};

export default fp(mikrorm);
