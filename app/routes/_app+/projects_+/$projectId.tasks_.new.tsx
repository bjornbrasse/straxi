import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'
import { action, TaskForm } from '../tasks_+/__task-form.tsx'

export { action }

export async function loader({ params }: DataFunctionArgs) {
	const project = await prisma.project.findUnique({
		where: { id: params.projectId },
		select: { id: true },
	})
	invariantResponse(project, 'Project not found', {
		headers: { Location: '/' },
	})
	return json({ project })
}

export default function ProjectTasksNewRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="h-full p-8">
			<TaskForm projectId={data.project.id} />
		</div>
	)
}
