import { json, type DataFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: DataFunctionArgs) {
	const project = await prisma.project.findUnique({
		where: { id: params.projectId },
		select: { id: true, name: true },
	})
	invariantResponse(project, 'Project not found', {
		headers: {
			Location: '/projects',
		},
	})
	return json({ project })
}

const FormSchema = z.discriminatedUnion('intent', [
	z.object({ intent: z.literal('delete'), projectId: z.string().cuid() }),
])

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const result = FormSchema.safeParse(Object.fromEntries(formData))
	invariantResponse(result.success, 'Error parsing request')
	if (result.data.intent === 'delete') {
		const project = await prisma.project.delete({
			where: { id: result.data.projectId },
		})
		invariantResponse(project, 'Project not deleted')
		return redirect('/projects')
	}
}

export default function ProjectRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="h-full border-t border-indigo-800">
			<div className="flex items-center justify-between p-4">
				<h2>{data.project.name}</h2>
				<div className="flex gap-1">
					<Form method="POST">
						<input type="hidden" name="projectId" value={data.project.id} />
						<Button
							name="intent"
							value="delete"
							variant="destructive"
							size="sm"
						>
							<Icon name="trash" />
						</Button>
					</Form>
					<Button size="sm" asChild>
						<Link to="edit">
							<Icon name="pencil-1" />
						</Link>
					</Button>
					<Button size="sm" asChild>
						<Link to="/projects">
							<Icon name="cross-1" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
