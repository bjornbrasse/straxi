import { type DataFunctionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

const AppointmentSchema = z.object({
	subject: z.string(),
	start: z.coerce.date(),
	end: z.coerce.date(),
	name: z.string(),
})

export async function action({ request }: DataFunctionArgs) {
	const createdById = await requireUserId(request)

	const result = AppointmentSchema.safeParse({
		...Object.fromEntries(await request.formData()),
		name: 'tijdelijk',
	})

	if (!result.success)
		return json({ errors: result.error.flatten() }, { status: 400 })

	const appointment = await prisma.appointment.create({
		data: { ...result.data, createdById },
	})

	if (!appointment) return json({ success: false }, { status: 400 })

	return json({ appointment })
}

export default function MeetingAppointmentNew() {
	const fetcher = useFetcher()

	function submitHandler(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		formData.set('start2', new Date().toISOString())
		fetcher.submit(formData, { method: 'POST' })
	}

	return (
		<div className="h-full bg-pink-200">
			<h1>Nieuwe afpsraak</h1>
			<fetcher.Form
				onSubmit={submitHandler}
				className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl bg-accent p-8"
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="subject">Onderwerp</Label>
					<Input name="subject" id="subject" />
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex gap-2">
						<Label htmlFor="startDate" className="w-12">
							Start:
						</Label>
						<div className="flex flex-col gap-2">
							<Input type="date" name="startDate" id="startDate" />
						</div>
						<div className="flex flex-col gap-2">
							<Input type="time" name="startTime" />
						</div>
					</div>
					<div className="flex gap-2">
						<Label htmlFor="endDate" className="w-12">
							Einde:
						</Label>
						<div className="flex flex-col gap-2">
							<Input type="date" name="endDate" id="endDate" />
						</div>
						<div className="flex flex-col gap-2">
							<Input type="time" name="endTime" />
						</div>
					</div>
				</div>
				<Button>Opslaan</Button>
			</fetcher.Form>
		</div>
	)
}
