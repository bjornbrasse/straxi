import { NavLink, Outlet } from '@remix-run/react'
import { type ReactNode } from 'react'
import { Icon } from '#app/components/ui/icon.tsx'
import { cn } from '#app/utils/misc.tsx'

export default function MeetingRoute() {
	return (
		<div className="flex h-full">
			<div
				id="tabs"
				className="flex flex-col gap-1 border-r-2 border-accent py-2 pl-2"
			>
				<Tab to="appointments">
					<Icon name="calendar" />
				</Tab>
				<Tab to="tasks">
					<Icon name="lightning-bolt" />
				</Tab>
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	)
}

function Tab({ children, to }: { children: ReactNode; to: string }) {
	return (
		<NavLink
			to={to}
			className={isActive =>
				cn(
					'flex h-16 w-10 justify-center rounded-l-xl bg-white py-4 text-2xl hover:bg-accent',
					isActive && 'bg-indigo-600 text-white',
					!isActive && 'bg-green-600 text-white',
				)
			}
		>
			{children}
		</NavLink>
	)
}
