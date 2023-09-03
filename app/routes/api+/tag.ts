import { promiseHash } from 'remix-utils'
import { prisma } from '#app/utils/db.server.ts'

export async function loader() {
	console.log('JLKWVJWELKVEWMKL')
	return promiseHash({
		tags: prisma.tag.findMany(),
	})
}
