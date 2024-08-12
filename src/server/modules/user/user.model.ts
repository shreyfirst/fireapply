import { Entity, Property } from "@mikro-orm/postgresql"
import { CoreEntity } from "../../lib/helpers/coreEntity"

@Entity()
export class User extends CoreEntity {
	@Property({ unique: true })
	email!: string

	@Property()
	password!: string
}
