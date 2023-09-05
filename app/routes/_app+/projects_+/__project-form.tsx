import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Project } from '@prisma/client'
import {
	type DataFunctionArgs,
	redirect,
	type SerializeFrom,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { z } from 'zod'
import { Field } from '#app/components/forms.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

const ProjectSchema = z.object({
	id: z.string().cuid().optional(),
	name: z.string(),
})

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const result = ProjectSchema.safeParse(
		Object.fromEntries(await request.formData()),
	)
	invariantResponse(result.success, 'Something went wrong', { status: 401 })
	const project = await prisma.project.create({
		// data: { ...result.data, createdById: userId },
		data: { name: result.data.name, createdById: userId },
		select: { id: true },
	})
	invariantResponse(project, 'Project not created')
	return redirect(`/projects/${project.id}`)
}

export function ProjectForm({
	project,
}: {
	project?: SerializeFrom<Pick<Project, 'id' | 'name'>>
}) {
	const fetcher = useFetcher()
	const isPending = fetcher.state !== 'idle'

	const [form, fields] = useForm({
		id: 'task-form',
		constraint: getFieldsetConstraint(ProjectSchema),
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ProjectSchema })
		},
		defaultValue: {
			name: project?.name ?? '',
			// lastName: task?.lastName ?? '',
			// email: task?.email ?? '',
		},
	})

	return (
		<fetcher.Form method="POST" {...form.props}>
			<Field
				labelProps={{ children: 'Onderwerp:' }}
				inputProps={{
					autoFocus: true,
					...conform.input(fields.name, { ariaAttributes: true }),
				}}
				errors={fields.name.errors}
			/>
			<StatusButton
				form={form.id}
				type="submit"
				disabled={isPending}
				status={isPending ? 'pending' : 'idle'}
			>
				Opslaan
			</StatusButton>
		</fetcher.Form>
	)
}
