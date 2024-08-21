import type { Processor, QueueOptions, WorkerOptions } from "bullmq"

export interface WorkerConfig {
	processor: Processor
	options: Omit<WorkerOptions, "connection">
}

export interface QueueConfig {
	options: Omit<QueueOptions, "connection">
	workers: Record<string, WorkerConfig>
}

export type QueueMap = {
	ApprovalQueue: QueueConfig
	EmailQueue: QueueConfig
}

const queues: QueueMap = {
	ApprovalQueue: {
		options: {},
		workers: {
			approvalWorker: {
				processor: async (job) => {
					return "hello"
				},
				options: {},
			},
		},
	},
	EmailQueue: {
		options: {},
		workers: {
			approvalWorke: {
				processor: async (job) => {
					return "hello"
				},
				options: {},
			},
		},
	},
}

export default queues
