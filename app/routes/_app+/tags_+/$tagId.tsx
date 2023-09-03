import { json, type DataFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: DataFunctionArgs) {
	const tag = await prisma.tag.findUnique({
		where: { id: params.tagId },
		select: { id: true, name: true },
	})
	invariantResponse(tag, 'Tag not found', {
		headers: {
			Location: '/tags',
		},
	})
	return json({ tag })
}

const FormSchema = z.discriminatedUnion('intent', [
	z.object({ intent: z.literal('delete'), tagId: z.string().cuid() }),
])

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const result = FormSchema.safeParse(Object.fromEntries(formData))
	invariantResponse(result.success, 'Error parsing request')
	if (result.data.intent === 'delete') {
		const tag = await prisma.tag.delete({
			where: { id: result.data.tagId },
		})
		invariantResponse(tag, 'Tag not deleted')
		return redirect('/tags')
	}
}

export default function TagRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="h-full border-t border-indigo-800">
			<div className="flex items-center justify-between p-4">
				<h2>{data.tag.name}</h2>
				<div className="flex gap-1">
					<Form method="POST">
						<input type="hidden" name="tagId" value={data.tag.id} />
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
						<Link to="/tags">
							<Icon name="cross-1" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
