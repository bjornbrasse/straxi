import { type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	return promiseHash({
		tags: prisma.tag.findMany({
			where: { createdById: userId },
			select: { id: true, name: true },
		}),
	})
}

export default function TagsRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="relative flex h-full flex-col">
			<div className="p-4">
				<h1>TagsRoute</h1>
			</div>
			<ul className="flex flex-1 list-none flex-col gap-1 overflow-y-auto border-2 border-blue-800 p-4">
				{data.tags.map(tag => (
					<li className="rounded-md bg-accent p-1" key={tag.id}>
						{tag.name}
					</li>
				))}
			</ul>
			<Button variant="fab" autoFocus asChild>
				<Link to="new">
					<Icon name="plus" />
				</Link>
			</Button>
		</div>
	)
}
