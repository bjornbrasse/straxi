import { json, type DataFunctionArgs, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

const MeetingSchema = z.object({ name: z.string() })

export async function action({ request }: DataFunctionArgs) {
	const createdById = await requireUserId(request)

	const result = MeetingSchema.safeParse(
		Object.fromEntries(await request.formData()),
	)

	if (!result.success) return json({ success: false }, { status: 400 })

	const meeting = await prisma.meeting.create({
		data: { ...result.data, createdById },
	})

	if (!meeting) return json({ success: false }, { status: 400 })

	return redirect(`/meetings/${meeting.id}`)
}

export default function NewMeetingRoute() {
	return (
		<div>
			<Form
				method="POST"
				className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl bg-accent p-8"
			>
				<Label htmlFor="name">Naam:</Label>
				<Input type="text" name="name" id="name" />
				<Button variant="default">Opslaan</Button>
			</Form>
		</div>
	)
}
