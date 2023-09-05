import { NavLink } from '@remix-run/react'
import { cn } from '#app/utils/misc.tsx'
import { type IconName, Icon } from './ui/icon.tsx'

export function NavTab({
	caption,
	className,
	iconName,
	to,
}: {
	caption: string
	iconName: IconName
	to: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn(
					'rounded-t-lg border-x border-t p-3 text-2xl text-accent sm:p-4',
					isActive && 'border-indigo-800 bg-indigo-400 text-white',
					!isActive && ' border-gray-300 bg-transparent text-gray-400',
					{ invisible: false },
					className,
				)
			}
		>
			<span className="hidden sm:inline">{caption}</span>
			<Icon name={iconName} className="block sm:hidden" />
		</NavLink>
	)
}
