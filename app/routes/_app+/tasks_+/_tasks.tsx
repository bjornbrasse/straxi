import { type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { Button } from '#app/components/ui/button.tsx'
import { Dialog } from '#app/components/ui/dialog.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { action, TaskForm } from './__task-form.tsx'

export { action }

export async function loader({ request }: DataFunctionArgs) {
	return promiseHash({ tasks: prisma.task.findMany({}) })
}

export default function TasksRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="relative h-full overflow-y-hidden border-4 border-red-500">
			<h1>TasksRoute</h1>
			<div className="flex flex-col gap-1 overflow-y-auto border-4 border-sky-600 p-4">
				{data.tasks.map(task => (
					<Link
						to={task.id}
						className="flex justify-between rounded-md bg-accent px-2 py-1"
						key={task.id}
					>
						<div>{task.name}</div>
						<Button size="sm">
							<Icon name="pencil-2" />
						</Button>
					</Link>
				))}
			</div>
			<Dialog>
				<Dialog.Trigger asChild>
					<Button variant="fab">
						<Icon name="plus" />
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<TaskForm />
				</Dialog.Content>
			</Dialog>
		</div>
	)
}
