// import { conform, useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { type Appointment } from '@prisma/client'
import {
	json,
	redirect,
	type DataFunctionArgs,
	type SerializeFrom,
} from '@remix-run/node'
import { type FetcherWithComponents } from '@remix-run/react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
// import { ErrorList, Field } from '#app/components/forms.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

const AppointmentSchema = z.object({
	id: z.string().cuid().optional(),
	meetingId: z.string().cuid().optional(),
	subject: z.string().min(2).max(100),
	start: z.coerce.date(),
	end: z.coerce.date(),
})

export async function action({ request }: DataFunctionArgs) {
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
	invariantResponse(updatedAppointment, 'Appointment not updated', {
		status: 400,
	})
	return redirect(`/calendar`)
}

export function AppointmentForm({
	appointment,
	fetcher,
}: {
	appointment?: SerializeFrom<
		Pick<Appointment, 'id' | 'end' | 'start' | 'subject'>
	>
	fetcher: FetcherWithComponents<SerializeFrom<typeof action>>
}) {
	const isPending = fetcher.state !== 'idle'

	const [dates, setDates] = useState<{
		startDate: string
		startTime: string
		endDate: string
		endTime: string
	}>({
		startDate: dayjs(appointment?.start).format('YYYY-MM-DD') ?? '',
		startTime: dayjs(appointment?.start).format('HH:mm') ?? '',
		endDate: dayjs(appointment?.end).format('YYYY-MM-DD') ?? '',
		endTime: dayjs(appointment?.end).format('HH:mm') ?? '',
	})

	useEffect(() => {
		console.log('Dates:', dates)
	}, [dates])

	// const [form, fields] = useForm({
	// 	id: 'appointment-form',
	// 	constraint: getFieldsetConstraint(AppointmentSchema),
	// 	lastSubmission: fetcher.data?.submission,
	// 	onValidate({ formData }) {
	// 		return parse(formData, { schema: AppointmentSchema })
	// 	},
	// 	defaultValue: {
	// 		subject: appointment?.subject ?? '',
	// 		start: appointment?.start ?? '',
	// 		end: appointment?.end ?? '',
	// 	},
	// })

	return (
		<fetcher.Form
			method="POST"
			className="flex flex-col gap-8 overflow-y-auto overflow-x-hidden p-4 sm:gap-4"
			id="appointment-form"
			// {...form.props}
		>
			{appointment ? (
				<input type="hidden" name="id" value={appointment.id} />
			) : null}
			{dates?.startDate && dates?.startTime && (
				<input
					type="hidden"
					name="start"
					value={`${dates.startDate} ${dates.startTime}`}
				/>
			)}
			{dates?.endDate && dates?.endTime && (
				<input
					type="hidden"
					name="end"
					value={`${dates.endDate} ${dates.endTime}`}
				/>
			)}

			{/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
			{/* <button type="submit" className="hidden" /> */}

			<div className="flex flex-col gap-1">
				<Label htmlFor="subject">Onderwerp:</Label>
				<Input
					id="subject"
					name="subject"
					defaultValue={appointment?.subject ?? ''}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<div className="flex flex-col gap-1">
						<Label htmlFor="startDate">Startdatum:</Label>
						<Input
							id="startDate"
							type="date"
							onInput={e => {
								const startDate = e.currentTarget.value
								setDates(v => ({ ...v, startDate }))
							}}
							defaultValue={dates.startDate}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="startTime">Starttijd:</Label>
						<Input
							id="startTime"
							type="time"
							onChange={e => {
								const startTime = e.currentTarget.value
								setDates(v => ({
									...v,
									startTime,
								}))
							}}
							defaultValue={dates.startTime}
						/>
					</div>
				</div>
				<div className="flex gap-2">
					<div className="flex flex-col gap-1">
						<Label htmlFor="endDate">Einnddatum:</Label>
						<Input
							id="endDate"
							type="date"
							onChange={e => {
								const endDate = e.currentTarget.value
								setDates(v => ({
									...v,
									endDate,
								}))
							}}
							defaultValue={dates.endDate}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="endTime">Eindtijd:</Label>
						<Input
							id="endTime"
							type="time"
							required
							onInput={e => {
								const endTime = e.currentTarget.value
								setDates(v => ({
									...v,
									endTime,
								}))
							}}
							defaultValue={dates.endTime}
						/>
					</div>
				</div>
			</div>
			{/* <ErrorList id={form.errorId} errors={form.errors} /> */}
			<div>
				{/* <Button form={form.id} variant="destructive" type="reset">
					Reset
				</Button> */}
				<StatusButton
					// form={form.id}
					id="iets-anders"
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
