import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ProjectForm } from '#app/routes/_app+/projects_+/__project-form.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params, request }: DataFunctionArgs) {
	await requireUserId(request)
	const project = await prisma.project.findUnique({
		where: { id: params.projectId },
		select: { id: true, name: true },
	})
	invariantResponse(project, 'Project not found')
	return json({ project })
}

export { action } from './__project-form.tsx'

export default function ProjectEditRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="h-full p-12">
			<h1>ProjectEditRoute</h1>
			<ProjectForm project={data.project} />
		</div>
	)
}
