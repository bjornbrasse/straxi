import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: DataFunctionArgs) {
	const task = await prisma.task.findUnique({ where: { id: params.taskId } })
	invariantResponse(task, 'Task not found', { headers: { Location: '/tasks' } })
	return json({ task })
}

export async function action({ request }: DataFunctionArgs) {
	return null
}

export default function TaskRoute() {
	const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="h-full p-12">
			<h1>TaskRoute {data.task.name}</h1>
		</div>
	)
}
