import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"
import { FastifyAdapter } from "@bull-board/fastify"
import { Queue, Worker } from "bullmq"
import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import { Redis } from "ioredis"
import { $env } from "../../../../env"
import queues, { type QueueMap } from "../../queues"
// Type for initialized queues and workers
type InitializedQueues = {
	[K in keyof QueueMap]: {
		queue: Queue
		workers: Record<string, Worker>
	}
}

declare module "fastify" {
	interface FastifyInstance {
		redis: Redis
		queues: InitializedQueues
	}
}

const bullmq: FastifyPluginAsync = async (fastify) => {
	try {
		const redis = new Redis({
			host: $env.CACHE_HOST,
			port: Number.parseInt($env.CACHE_PORT),
			password: $env.CACHE_PASS,
			maxRetriesPerRequest: null,
		})

		await fastify.decorate("redis", redis)

		const initializedQueues: InitializedQueues = {} as InitializedQueues

		// Initialize queues and workers
		for (const [queueName, queueConfig] of Object.entries(queues)) {
			const queue = new Queue(queueName, {
				connection: redis,
				...queueConfig.options,
			})

			const workers: Record<string, Worker> = {}
			for (const [workerName, workerConfig] of Object.entries(
				queueConfig.workers,
			)) {
				workers[workerName] = new Worker(queueName, workerConfig.processor, {
					connection: redis,
					...workerConfig.options,
				})
			}

			initializedQueues[queueName as keyof QueueMap] = { queue, workers }
		}

		// Decorate fastify instance with queues
		await fastify.decorate("queues", initializedQueues)

		const serverAdapter = new FastifyAdapter()

		const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard(
			{
				queues: Object.values(initializedQueues).map(
					({ queue }) => new BullMQAdapter(queue),
				),
				serverAdapter: serverAdapter,
			},
		)

		serverAdapter.setBasePath("/panel/queues")
		fastify.register(serverAdapter.registerPlugin(), {
			basePath: "/panel/queues",
			prefix: "/panel/queues",
		})

		// Shut down the connection and workers when closing the app
		fastify.addHook("onClose", async (fastify) => {
			for (const { queue, workers } of Object.values(initializedQueues)) {
				await queue.close()
				for (const worker of Object.values(workers)) {
					await worker.close()
				}
			}
			await redis.quit()
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export default fp(bullmq)
