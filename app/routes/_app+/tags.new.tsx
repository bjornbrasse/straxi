import { type DataFunctionArgs, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'
// import { useActionData, useLoaderData } from '@remix-run/react'

const TagSchema = z.object({
	name: z.string().min(2).max(50),
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
	})
	invariantResponse(tag, 'Tag not created')
	return redirect('/tags')
}

export default function NewTagRoute() {
	// const actionData = useActionData<typeof action>()

	return (
		<div className="h-full p-12">
			<h1>NewTagRoute</h1>
			<Form method="POST">
				<Label htmlFor="name">Naam:</Label>
				<Input id="name" name="name" autoFocus />
				<Button type="submit">Opslaan</Button>
			</Form>
		</div>
	)
}
