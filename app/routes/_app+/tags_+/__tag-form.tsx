import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Tag } from '@prisma/client'
import {
	type DataFunctionArgs,
	redirect,
	type SerializeFrom,
} from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'
import { z } from 'zod'
import { Field } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

const TagSchema = z.object({
	id: z.string().cuid().optional(),
	name: z.string(),
})

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const result = TagSchema.safeParse(
		Object.fromEntries(await request.formData()),
	)
	invariantResponse(result.success, 'Something went wrong', { status: 401 })
	const tag = await prisma.tag.create({
		// data: { ...result.data, createdById: userId },
		data: { name: result.data.name, createdById: userId },
		select: { id: true },
	})
	invariantResponse(tag, 'Tag not created')
	return redirect(`/tags/${tag.id}`)
}

export function TagForm({
	tag,
}: {
	tag?: SerializeFrom<Pick<Tag, 'id' | 'name'>>
}) {
	const fetcher = useFetcher()
	const isPending = fetcher.state !== 'idle'

	const [form, fields] = useForm({
		id: 'task-form',
		constraint: getFieldsetConstraint(TagSchema),
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: TagSchema })
		},
		defaultValue: {
			name: tag?.name ?? '',
			// lastName: task?.lastName ?? '',
			// email: task?.email ?? '',
		},
	})

	return (
		<Form method="POST" {...form.props}>
			<Field
				labelProps={{ children: 'Onderwerp:' }}
				inputProps={{
					autoFocus: true,
					...conform.input(fields.name, { ariaAttributes: true }),
				}}
				errors={fields.name.errors}
			/>
			<Button type="submit">Opslaan</Button>
			<StatusButton
				form={form.id}
				type="submit"
				disabled={isPending}
				status={isPending ? 'pending' : 'idle'}
			>
				Opslaan
			</StatusButton>
		</Form>
	)
}
