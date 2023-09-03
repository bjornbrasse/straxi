import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Task } from '@prisma/client'
import {
	json,
	redirect,
	type DataFunctionArgs,
	type SerializeFrom,
} from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'
import { TagCombobox } from '../tags_+/__tag-combobox.tsx'

const TaskSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(2).max(100),
	start: z.coerce.date(),
	end: z.coerce.date().optional(),
	followUp: z.coerce.date().optional(),
	description: z.string().optional(),
})

export async function action({ request }: DataFunctionArgs) {
	console.log('DEZE MEOT IK ZIEN   VKVLWJVLWKVJWVKLWVJ')
	const userId = await requireUserId(request)

	const formData = await request.formData()
	const submission = await parse(formData, {
		schema: TaskSchema.superRefine(async ({ id }, ctx) => {
			if (!id) return

			const Task = await prisma.task.findUnique({
				where: { id },
				select: { id: true },
			})
			if (!Task) {
				ctx.addIssue({
					code: 'custom',
					message: 'Task not found',
				})
			}
		}),
		async: true,
	})

	// if (submission.intent !== 'submit') {
	// 	return json({ status: 'idle', submission } as const)
	// }

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { id, ...data } = submission.value

	const task = await prisma.task.upsert({
		where: { id: id ?? '__new_task__' },
		create: {
			...data,
			createdById: userId,
		},
		update: {
			...data,
		},
		select: { id: true },
	})

	invariantResponse(task, `Task not ${id ? 'updated' : 'created'}`)

	return redirect(`/tasks/${task.id}`)
}

export function TaskForm({
	task,
}: {
	task?: SerializeFrom<Pick<Task, 'id' | 'start' | 'end'>>
}) {
	const fetcher = useFetcher<typeof action>()
	const isPending = fetcher.state !== 'idle'

	const [form, fields] = useForm({
		id: 'task-form',
		constraint: getFieldsetConstraint(TaskSchema),
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: TaskSchema })
		},
		defaultValue: {
			// firstName: task?.firstName ?? '',
			// lastName: task?.lastName ?? '',
			// email: task?.email ?? '',
		},
	})

	const [tagsSelected, setTagsSelected] = useState<
		Array<{ value: string; caption: string }>
	>([])

	return (
		<Form
			method="POST"
			className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-4 sm:gap-4"
			{...form.props}
		>
			{task ? <input type="hidden" name="id" value={task.id} /> : null}

			{/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
			<button type="submit" className="hidden" />

			<Field
				labelProps={{ children: 'Onderwerp:' }}
				inputProps={{
					autoFocus: true,
					...conform.input(fields.name, { ariaAttributes: true }),
				}}
				errors={fields.name.errors}
			/>
			<div className="flex gap-1 overflow-x-hidden">
				{tagsSelected.map(l => (
					<div
						className="flex items-center rounded-lg bg-accent px-2 py-1 text-sm"
						key={l.value}
					>
						{l.caption}
						<Button variant="transparent">
							<Icon name="cross-1" />
						</Button>
					</div>
				))}
			</div>
			<TagCombobox
				onSelectedItemChange={({ selectedItem }) => {
					if (selectedItem) setTagsSelected(prev => [...prev, selectedItem])
				}}
			/>
			<ErrorList id={form.errorId} errors={form.errors} />
			<div>
				{/* <Button form={form.id} variant="destructive" type="reset">
					Reset
				</Button> */}
				<StatusButton
					form={form.id}
					type="submit"
					disabled={isPending}
					status={isPending ? 'pending' : 'idle'}
				>
					Opslaan
				</StatusButton>
			</div>
		</Form>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No note with the id "{params.noteId}" exists</p>
				),
			}}
		/>
	)
}
