import { type DataFunctionArgs, json } from '@remix-run/node'
import {
	Outlet,
	type V2_MetaFunction,
	useLoaderData,
	useParams,
} from '@remix-run/react'
import { NavTab } from '#app/components/navtab.tsx'
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
	const { contactId, projectId, taskId } = useParams()

	return (
		<div className="flex h-full flex-col overflow-y-hidden">
			<div className="hidden h-12 items-end gap-1 bg-gray-400 sm:flex">
				{data.tabs.map(tab => (
					<Tab tab={tab} key={tab.id} />
				))}
			</div>
			<div
				id="tabs"
				className="flex w-full flex-row gap-1.5 border-b border-indigo-800 px-4 pt-2 sm:w-48 sm:flex-col"
			>
				<NavTab
					caption="Calendar"
					iconName="calendar"
					to="/calendar"
					className={cn({
						'transform opacity-0 duration-150':
							contactId || projectId || taskId,
					})}
				/>
				<NavTab
					caption="Projecten"
					iconName="mix"
					to="/projects"
					className={cn('transition-transform duration-500 ease-in-out', {
						'transform opacity-0 duration-500': contactId || taskId,
						'delay-50 -translate-x-14': projectId,
					})}
				/>
				<NavTab
					caption="Taken"
					iconName="lightning-bolt"
					to="/tasks"
					className={cn({
						'transform opacity-0 duration-500': contactId || projectId,
						'delay-50 -translate-x-[112px] transform duration-300': taskId,
					})}
				/>
				<NavTab
					caption="Gebruikers"
					iconName="person"
					to="/contacts"
					className={cn({
						'transform opacity-0 duration-500': projectId || taskId,
						'delay-50 -translate-x-[168px] transform duration-300': contactId,
					})}
				/>
				<NavTab
					caption="Vergaderingen"
					iconName="chat-bubble"
					to="/meetings"
					className={cn({
						'transform opacity-0 duration-500':
							contactId || projectId || taskId,
					})}
				/>
			</div>
			<div className="flex-1 translate-x-0 overflow-y-hidden">
				<Outlet />
			</div>
		</div>
	)
}

export const meta: V2_MetaFunction = () => [{ title: 'Straxi' }]
