import { type DataFunctionArgs, json } from '@remix-run/node'
import {
	NavLink,
	Outlet,
	type V2_MetaFunction,
	useLoaderData,
} from '@remix-run/react'
import { Tab } from '#app/components/tab.tsx'
import { Icon, type IconName } from '#app/components/ui/icon.tsx'
import { cn } from '#app/utils/misc.tsx'
import { sessionStorage } from '#app/utils/session.server.ts'
import { useOptionalUser } from '#app/utils/user.ts'

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
	const user = useOptionalUser()

	return (
		<>
			{user ? (
				<div className="flex h-full flex-col overflow-hidden">
					<div className="hidden h-12 items-end gap-1 bg-gray-400 sm:flex">
						{data.tabs.map(tab => (
							<Tab tab={tab} key={tab.id} />
						))}
					</div>
					<div className="flex h-full flex-1 flex-col sm:flex-row">
						<div
							id="tabs"
							className="flex w-full flex-row gap-1.5 border-b border-indigo-800 px-4 pt-2 sm:w-48 sm:flex-col"
						>
							<NavTab caption="Calendar" iconName="calendar" to="/calendar" />
							<NavTab caption="Taken" iconName="lightning-bolt" to="/tasks" />
							<NavTab caption="Gebruikers" iconName="person" to="/contacts" />
							<NavTab caption="Taken" iconName="tag" to="/tags" />
							<NavTab
								caption="Vergaderingen"
								iconName="chat-bubble"
								to="/meetings"
							/>
						</div>
						<div className="flex-1 overflow-auto">
							<Outlet />
						</div>
					</div>
				</div>
			) : (
				<Outlet />
			)}
		</>
	)
}

function NavTab({
	caption,
	iconName,
	to,
}: {
	caption: string
	iconName: IconName
	to: string
}) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn(
					'rounded-t-lg border-x border-t p-3 text-2xl text-accent sm:p-4',
					isActive && 'border-indigo-800 bg-indigo-400 text-white',
					!isActive && ' border-gray-300 bg-transparent text-gray-400',
				)
			}
		>
			<span className="hidden sm:inline">{caption}</span>
			<Icon name={iconName} className="block sm:hidden" />
		</NavLink>
	)
}

export const meta: V2_MetaFunction = () => [{ title: 'Straxi' }]
