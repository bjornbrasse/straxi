import { type DataFunctionArgs, json } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { Tab } from '#app/components/tab.tsx'
import { cn } from '#app/utils/misc.tsx'
import { sessionStorage } from '#app/utils/session.server.ts'

export async function loader({ request }: DataFunctionArgs) {
	const cookieSession = await sessionStorage.getSession(
		request.headers.get('cookie'),
	)

	const tabs = (JSON.parse(String(cookieSession.get('tabs') ?? null)) ||
		[]) as Array<{
		name: string
		id: string
	}>

	return json(
		{ tabs },
		{
			headers: {
				'set-cookie': await sessionStorage.commitSession(cookieSession),
			},
		},
	)
}

export default function AppLayout() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-12 items-end gap-1 bg-gray-400 px-2">
				{data.tabs.map(tab => (
					<Tab tab={tab} key={tab.id} />
				))}
			</div>
			<div className="flex h-full flex-1 border-2 border-emerald-700">
				<div className="flex w-48 flex-col border-4 border-sky-800">
					<NavLink
						to="users"
						className={isActive =>
							cn(
								'p-4 text-accent',
								isActive && 'bg-red-500',
								!isActive && 'bg-transparent',
							)
						}
					>
						Gebruikers
					</NavLink>
					<NavLink
						to="meetings"
						className={isActive =>
							cn(
								'p-4 text-accent',
								isActive && 'bg-red-500',
								!isActive && 'bg-transparent',
							)
						}
					>
						Vergaderingen
					</NavLink>
				</div>
				<div className="flex-1 border-4 border-fuchsia-800">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
