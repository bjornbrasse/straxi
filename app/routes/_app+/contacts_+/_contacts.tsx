import { type DataFunctionArgs } from '@remix-run/node'
import {
	Link,
	NavLink,
	Outlet,
	useLoaderData,
	useParams,
} from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn } from '#app/utils/misc.tsx'

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
	const { contactId } = useParams()

	return (
		<div className="relative flex h-full flex-col overflow-y-hidden">
			<div
				className={cn(
					'flex flex-col gap-1 overflow-y-auto rounded-md p-4 pr-5',
					{ 'h-40': contactId, 'flex-1': !contactId },
				)}
			>
				{data.users.map(user => (
					<NavLink
						to={user.id}
						className="rounded-md bg-accent p-1"
						key={user.id}
					>
						{user.name}
					</NavLink>
				))}
				{!contactId && (
					<Button
						variant="fab"
						className="h-14 w-14 rounded-full text-2xl font-bold"
						asChild
					>
						<Link to="new">
							<Icon name="plus" />
						</Link>
					</Button>
				)}
			</div>
			{contactId && (
				<div className="flex-1">
					<Outlet />
				</div>
			)}
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
