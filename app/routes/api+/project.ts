import { promiseHash } from 'remix-utils'
import { prisma } from '#app/utils/db.server.ts'

export async function loader() {
	return promiseHash({
		projects: prisma.project.findMany({ select: { id: true, name: true } }),
	})
}