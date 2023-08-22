import { type DataFunctionArgs, json } from '@remix-run/node'
import { NavLink, Outlet, useFetcher, useLoaderData } from '@remix-run/react'
import { cn } from '#app/utils/misc.tsx'
import { sessionStorage } from '#app/utils/session.server.ts'
import { Icon } from '#app/components/ui/icon.tsx'

export async function loader({ request }: DataFunctionArgs) {
	const cookieSession = await sessionStorage.getSession(
		request.headers.get('cookie'),
	)
	console.log(
		'🚀 ~ file: _app.tsx:10 ~ loader ~ cookieSession:',
		cookieSession.data,
	)

	const tabs = (JSON.parse(String(cookieSession.get('tabs') ?? null)) ||
		[]) as Array<{
		name: string
		id: string
	}>
	console.log('🚀 ~ file: _app.tsx:12 ~ tabs ~ tabs:', tabs)

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

function Tab({ tab }: { tab: { id: string; name: string } }) {
	const fetcher = useFetcher()
	return (
		<div className="flex overflow-x-hidden text-ellipsis whitespace-nowrap rounded-t-md bg-blue-500 px-2 pb-1 pt-2 text-white">
			<span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
				{tab.name}
			</span>
			<fetcher.Form action="/api/tab" method="POST">
				<input type="hidden" name="id" value={tab.id} />
				<button type="submit" name="intent" value="closeTab" className="ml-2">
					<Icon name="cross-1" />
				</button>
			</fetcher.Form>
		</div>
	)
}
