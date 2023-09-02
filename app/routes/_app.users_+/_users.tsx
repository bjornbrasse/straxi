import { type DataFunctionArgs } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	await requireUserId(request)

	return promiseHash({
		users: prisma.user.findMany({
			select: { id: true, name: true, username: true },
		}),
	})
}

export default function UsersRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="container flex h-full gap-16 py-8">
			<div className="flex flex-col gap-1 rounded-md bg-accent py-4 pl-2 pr-12">
				{data.users.map(user => (
					<NavLink to={user.username} key={user.id}>
						{user.name}
					</NavLink>
				))}
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
