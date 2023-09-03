import { type DataFunctionArgs, json, redirect } from '@remix-run/node'
import {
	NavLink,
	Outlet,
	type V2_MetaFunction,
	useLoaderData,
	Link,
} from '@remix-run/react'
import { Icon, type IconName } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn } from '#app/utils/misc.tsx'

export async function loader({ params, request }: DataFunctionArgs) {
	await requireUserId(request)

	const meeting = await prisma.meeting.findUnique({
		where: { id: params.meetingId },
		select: { id: true, name: true },
	})
	if (!meeting) return redirect('/meetings')
	return json({ meeting })
}

export default function MeetingLayout() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="bg-gray-400 p-4">
				<Link to="/meetings">
					<Icon name="arrow-left" />
				</Link>
				<span>{data.meeting?.name}</span>
			</div>
			<div className="flex h-full flex-1 flex-col sm:flex-row">
				<div
					id="tabs"
					className="flex w-full flex-row gap-1 border-b border-indigo-800 bg-red-400 px-2 pt-2 sm:w-48 sm:flex-col"
				>
					<NavTab caption="Afpsraken" iconName="calendar" to="appointments" />
					<NavTab caption="Taken" iconName="lightning-bolt" to="tasks" />
				</div>
				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</div>
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
