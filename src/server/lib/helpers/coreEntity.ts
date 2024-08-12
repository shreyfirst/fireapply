import { PrimaryKey, Property } from "@mikro-orm/postgresql"

export abstract class CoreEntity {
	@PrimaryKey()
	id!: number

	@Property()
	createdAt = new Date()

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date()
}
