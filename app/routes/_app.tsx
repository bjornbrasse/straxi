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
	const { projectId } = useParams()

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
							<NavTab
								caption="Calendar"
								iconName="calendar"
								to="/calendar"
								className={cn({
									'transform opacity-0 duration-150': projectId,
								})}
							/>
							<NavTab
								caption="Projecten"
								iconName="mix"
								to="/projects"
								className={cn({
									'delay-50 -translate-x-14 transform duration-300': projectId,
								})}
							/>
							<NavTab
								caption="Taken"
								iconName="lightning-bolt"
								to="/tasks"
								className={cn({
									'transform opacity-0 duration-150': projectId,
								})}
							/>
							<NavTab
								caption="Gebruikers"
								iconName="person"
								to="/contacts"
								className={cn({
									'transform opacity-0 duration-150': projectId,
								})}
							/>

							{/* <NavTab caption="Taken" iconName="tag" to="/tags" /> */}
							<NavTab
								caption="Vergaderingen"
								iconName="chat-bubble"
								to="/meetings"
								className={cn({
									'transform opacity-0 duration-150': projectId,
								})}
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

export const meta: V2_MetaFunction = () => [{ title: 'Straxi' }]
