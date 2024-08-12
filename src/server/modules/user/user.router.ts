import { publicProcedure, router } from "../../router"

export default {
	user: router({
		hello: publicProcedure.query(async () => {
			return "world"
		}),
	}),
}
