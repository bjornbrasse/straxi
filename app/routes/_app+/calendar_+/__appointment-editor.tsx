import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type Appointment } from '@prisma/client'
import {
	json,
	redirect,
	type DataFunctionArgs,
	type SerializeFrom,
} from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariant } from '#app/utils/misc.tsx'

const AppointmentSchema = z.object({
	id: z.string().optional(),
	meetingId: z.string().cuid(),
	start: z.coerce.date(),
	subject: z.string().min(2).max(100),
	end: z.coerce.date(),
})

export async function action({ params, request }: DataFunctionArgs) {
	invariant(params.organisationSlug, 'Organisation Slug not found')
	invariant(params.applicationSlug, 'Application Slug not found')
	invariant(params.testId, 'Test ID not found')

	const userId = await requireUserId(request)

	const formData = await request.formData()
	const submission = await parse(formData, {
		schema: AppointmentSchema.superRefine(async ({ id }, ctx) => {
			if (!id) return

			const Appointment = await prisma.appointment.findUnique({
				where: { id },
				select: { id: true },
			})
			if (!Appointment) {
				ctx.addIssue({
					code: 'custom',
					message: 'Appointment not found',
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

	const { id, ...data } = submission.value

	const updatedAppointment = await prisma.appointment.upsert({
		where: { id: id ?? '__new_test-action__' },
		create: {
			...data,
			createdById: userId,
		},
		update: {
			...data,
		},
		select: { id: true },
	})

	if (!updatedAppointment) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	return redirect(`/calendar}`)
}

export function AppointmentEditor({
	appointment,
}: {
	appointment?: SerializeFrom<
		Pick<Appointment, 'id' | 'end' | 'start' | 'subject'>
	>
}) {
	const fetcher = useFetcher<typeof action>()
	const isPending = fetcher.state !== 'idle'

	const [form, fields] = useForm({
		id: 'test-action-editor',
		constraint: getFieldsetConstraint(AppointmentSchema),
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: AppointmentSchema })
		},
		defaultValue: {
			subject: appointment?.subject ?? '',
			start: appointment?.start ?? '',
			end: appointment?.end ?? '',
		},
	})

	return (
		<Form
			method="POST"
			className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-4 sm:gap-4"
			{...form.props}
		>
			{appointment ? (
				<input type="hidden" name="id" value={appointment.id} />
			) : null}

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
					...conform.input(fields.subject, { ariaAttributes: true }),
				}}
				errors={fields.subject.errors}
			/>
			<div className="flex flex-col">
				<div className="flex gap-2">
					<Field
						labelProps={{ children: 'Start:' }}
						inputProps={{
							...conform.input(fields.start, { ariaAttributes: true }),
							type: 'date',
						}}
						errors={fields.start.errors}
					/>
					<Field
						labelProps={{ children: 'Starttijd:' }}
						inputProps={{
							// ...conform.input(fields.end, { ariaAttributes: true }),
							type: 'time',
						}}
						errors={fields.end.errors}
					/>
				</div>
				<div className="flex gap-2">
					<Field
						labelProps={{ children: 'Einde:' }}
						inputProps={{
							// ...conform.input(fields.start, { ariaAttributes: true }),
							type: 'date',
						}}
						errors={fields.start.errors}
					/>
					<Field
						labelProps={{ children: 'Eindtijd:' }}
						inputProps={{
							// ...conform.input(fields.end, { ariaAttributes: true }),
							type: 'time',
						}}
						errors={fields.end.errors}
					/>
				</div>
			</div>
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
