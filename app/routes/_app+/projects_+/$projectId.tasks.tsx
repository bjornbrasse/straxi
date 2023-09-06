import { type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params }: DataFunctionArgs) {
	return promiseHash({
		tasks: prisma.task.findMany({
			where: { projectTasks: { some: { projectId: params.projectId } } },
			select: { id: true, name: true },
		}),
	})
}

export default function ProjectTasksRoute() {
	const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="flex h-full flex-col">
			<p className="mx-auto py-2 text-xl font-bold text-indigo-900">Taken</p>
			<div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-16">
				{data.tasks.map(task => (
					<div className="flex rounded-md bg-accent px-2 py-1" key={task.id}>
						{task.name}
					</div>
				))}
			</div>
			<Button variant="fab" asChild>
				<Link to="new">
					<Icon name="plus" />
				</Link>
			</Button>
		</div>
	)
}
