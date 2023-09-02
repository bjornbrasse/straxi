import { type DataFunctionArgs } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	return promiseHash({
		meetings: prisma.meeting.findMany({ select: { id: true, name: true } }),
	})
}

export default function MeetingsLayout() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="p-4">
			<div className="mb-4 flex items-center justify-between border-b-2 border-indigo-700">
				<h1>Vergaderingen</h1>
				<Link to="new" className="rounded-full">
					<Icon name="plus" />
				</Link>
			</div>
			<div className="md: grid grid-cols-4 gap-4">
				{data.meetings.map(meeting => (
					<Form
						action="/api/tab"
						method="POST"
						className="rounded-md bg-accent p-2"
						key={meeting.id}
					>
						<button
							name="intent"
							value="openTab"
							type="submit"
							className="bg-blue-700 text-white"
						>
							{meeting.name}
						</button>
						<input type="hidden" name="id" value={meeting.id} />
						<input type="hidden" name="name" value={meeting.name} />
					</Form>
				))}
			</div>
			<Outlet />
		</div>
	)
}
