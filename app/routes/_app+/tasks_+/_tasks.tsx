import { type DataFunctionArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	return promiseHash({ tasks: prisma.task.findMany({}) })
}

export default function TasksRoute() {
	// const data = useLoaderData<typeof loader>()

	return (
		<div className="relative h-full border-4 border-pink-800 p-4">
			<h1>TasksRoute</h1>
			<div className="overflow-y-auto border-4 border-sky-600 p-4"></div>
			<Button variant="fab" asChild>
				<Link to="new">
					<Icon name="plus" />
				</Link>
			</Button>
		</div>
	)
}
