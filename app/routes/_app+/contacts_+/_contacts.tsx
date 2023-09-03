import { type DataFunctionArgs } from '@remix-run/node'
import {
	Link,
	NavLink,
	Outlet,
	useFetcher,
	useLoaderData,
	useParams,
} from '@remix-run/react'
import { useRef } from 'react'
import { promiseHash } from 'remix-utils'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn, useDebounce } from '#app/utils/misc.tsx'

export async function loader({ request }: DataFunctionArgs) {
	await requireUserId(request)

	return promiseHash({
		contacts: prisma.contact.findMany({
			select: { id: true, firstName: true, lastName: true },
		}),
	})
}

export default function UsersRoute() {
	const data = useLoaderData<typeof loader>()
	const { contactId } = useParams()
	const fetcher = useFetcher()
	const searchRef = useRef<HTMLInputElement>(null)

	function searchHandler(e: React.ChangeEvent<HTMLInputElement>) {
		console.log('NU', e.currentTarget.value)
		fetcher.load(e.currentTarget.value)
	}
	const debouncedSearchHandler = useDebounce(searchHandler, 1000)

	return (
		<div className="relative flex h-full flex-col overflow-y-hidden">
			<div
				className={cn(
					'flex flex-col gap-1 overflow-y-auto rounded-md p-4 pr-5',
					{ 'h-40': contactId, 'flex-1': !contactId },
				)}
			>
				<div className="flex justify-between gap-2">
					<Input onChange={debouncedSearchHandler} ref={searchRef} />
					<Button
						onClick={() => {
							if (searchRef.current?.value) searchRef.current.value = ''
						}}
					>
						<Icon name="cross-1" />
					</Button>
				</div>
				{data.contacts.map(contact => (
					<NavLink
						to={contact.id}
						className={({ isActive }) =>
							cn('rounded-md p-1', {
								'bg-highlight text-highlight-foreground': isActive,
								'bg-accent text-accent-foreground': !isActive,
							})
						}
						key={contact.id}
					>
						{`${contact.firstName} ${contact.lastName}`}
					</NavLink>
				))}
				{!contactId && (
					<Button variant="fab" asChild>
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
