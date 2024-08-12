import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Twilio } from "twilio";
import { $env } from "../../../env";

declare module "fastify" {
	interface FastifyInstance {
		sms: Twilio;
	}
}

const sms: FastifyPluginAsync = async (fastify) => {
	const accountSid = $env.TWILIO_ACCOUNTSID;
	const authToken = $env.TWILIO_AUTHTOKEN;

	const client = new Twilio(accountSid, authToken);

	await fastify.decorate("sms", client);

	await fastify.addHook("onClose", async (instance) => {
		instance.sms = new Twilio();
	});
};

export default fp(sms);
