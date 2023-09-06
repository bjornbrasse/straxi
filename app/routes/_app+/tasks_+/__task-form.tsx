import { useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Task } from '@prisma/client'
import {
	json,
	redirect,
	type DataFunctionArgs,
	type SerializeFrom,
} from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
// import { ErrorList } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'
import { TagCombobox } from '../tags_+/__tag-combobox.tsx'
// import { TagCombobox } from '../tags_+/__tag-combobox.tsx'

const TaskSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(2).max(100),
	start: z.coerce.date(),
	end: z.coerce.date().optional(),
	followUp: z.coerce.date().optional(),
	description: z.string().optional(),
	projectId: z.string().cuid().optional(),
})

export async function action({ request }: DataFunctionArgs) {
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

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { id, projectId, ...data } = submission.value

	const task = await prisma.task.upsert({
		where: { id: id ?? '__new_task__' },
		create: {
			...data,
			projectTasks: projectId ? { create: { projectId } } : undefined,
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
	projectId,
}: {
	task?: SerializeFrom<Pick<Task, 'id' | 'name' | 'start' | 'end'>>
	projectId?: string
}) {
	const fetcher = useFetcher<typeof action>()
	const isPending = fetcher.state !== 'idle'

	// const [form, fields] = useForm({
	const [form] = useForm({
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
		<fetcher.Form
			method="POST"
			className="flex w-11/12 flex-col gap-4 rounded-lg border-2 border-blue-300 p-4"
		>
			{/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
			{/* <button type="submit" className="hidden" /> */}
			{task && <input type="hidden" name="id" value={task.id} />}
			{projectId && <input type="hidden" name="projectId" value={projectId} />}

			<div className="flex flex-col gap-1">
				<Label htmlFor="name">Naam:</Label>
				<Input id="name" name="name" />
			</div>

			{/* <Field
				labelProps={{ children: 'Onderwerp:' }}
				inputProps={{
					autoFocus: true,
					...conform.input(fields.name, { ariaAttributes: true }),
				}}
				errors={fields.name.errors}
			/> */}
			<div className="flex flex-col gap-1">
				<Label htmlFor="start">Start:</Label>
				<Input id="start" name="start" type="date" />
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="end">Einde:</Label>
				<Input id="end" name="end" type="date" />
			</div>
			<div className="w-48">
				<div className="flex gap-1 overflow-x-auto">
					{tagsSelected.map(l => (
						<div
							className="flex grow-0 items-center rounded-lg bg-accent px-2 py-1 text-sm"
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
					onSelectedItemChange={({ selectedItem, ...change }) => {
						if (selectedItem) setTagsSelected(prev => [...prev, selectedItem])
						change.inputValue = ''
						change.isOpen = false
					}}
				/>
			</div>
			{/* <ErrorList id={form.errorId} errors={form.errors} /> */}
			<div>
				{/* <Button form={form.id} variant="destructive" type="reset">
		 			Reset
		 		</Button> */}
				<StatusButton
					// form={form.id}
					type="submit"
					disabled={isPending}
					status={isPending ? 'pending' : 'idle'}
				>
					Opslaan
				</StatusButton>
			</div>
		</fetcher.Form>
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
