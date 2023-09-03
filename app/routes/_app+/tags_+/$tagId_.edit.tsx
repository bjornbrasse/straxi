import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'
import { TagForm } from './__tag-form.tsx'

export async function loader({ params, request }: DataFunctionArgs) {
	await requireUserId(request)
	const tag = await prisma.tag.findUnique({
		where: { id: params.tagId },
		select: { id: true, name: true },
	})
	invariantResponse(tag, 'Tag not found')
	return json({ tag })
}

export { action } from './__tag-form.tsx'

export default function TagEditRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="h-full p-12">
			<h1>TagEditRoute</h1>
			<TagForm tag={data.tag} />
		</div>
	)
}
