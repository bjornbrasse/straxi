import { type DataFunctionArgs } from '@remix-run/node'
import {
	useLoaderData,
	Link,
	NavLink,
	useParams,
	Outlet,
} from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { DateSelector } from '#app/components/date-selector.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Dialog } from '#app/components/ui/dialog.tsx'
import { DropdownMenu } from '#app/components/ui/dropdown-menu_new.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn } from '#app/utils/misc.tsx'
import { useState } from 'react'
import { Input } from '#app/components/ui/input.tsx'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	return promiseHash({
		projects: prisma.project.findMany({
			where: { createdById: userId },
			select: { id: true, name: true },
		}),
	})
}

export default function ProjectsRoute() {
	const data = useLoaderData<typeof loader>()
	const { projectId } = useParams()
	const [showSearch, setShowSearch] = useState(false)

	if (projectId)
		return (
			<div className="flex h-full">
				<Outlet />
			</div>
		)

	return (
		<div className="flex h-full flex-col overflow-y-hidden">
			<div className="relative flex w-full items-center justify-center py-2">
				<span className="text-xl font-bold text-indigo-900">Projecten</span>
				<DropdownMenu>
					<DropdownMenu.Trigger className="absolute right-12 bg-gray-400 p-1">
						<Icon name="caret-sort" size="lg" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item>Naam</DropdownMenu.Item>
						<DropdownMenu.Item>Opvolgdatum</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu>
				<button
					onClick={() => setShowSearch(v => !v)}
					className="absolute right-2 bg-gray-400 p-1"
				>
					<Icon name="magnifying-glass" size="lg" />
				</button>
			</div>
			<div
				className={cn(
					'scale-y-0 border border-blue-500 p-2 transition-transform duration-500 ease-in-out',
					{
						'scale-y-100': showSearch,
					},
				)}
			>
				<Input />
			</div>
			<ul
				className={cn(
					'flex flex-1 list-none flex-col gap-1 overflow-y-auto px-4 pb-16',
					{
						hidden: projectId,
						'flex-1': !projectId,
					},
				)}
			>
				{data.projects
					.sort((a, b) =>
						a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0,
					)
					.map(project => (
						<NavLink
							to={project.id}
							className={({ isActive }) =>
								cn('rounded-md bg-accent px-2 py-1', {
									'bg-highlight': isActive,
								})
							}
							key={project.id}
						>
							<li className="flex items-center justify-between">
								{project.name}
								<DropdownMenu>
									<DropdownMenu.Trigger asChild>
										<Button
											onClick={e => {
												e.preventDefault()
											}}
											type="button"
											variant="transparent"
											size="xs"
										>
											<Icon name="dots-vertical" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Item
											onClick={e => {
												e.stopPropagation()
											}}
											asChild
										>
											<Dialog open={true} onOpenChange={() => true}>
												<Dialog.Trigger>Set FollowUp Date</Dialog.Trigger>
												<Dialog.Content>
													{/* <DateSelector
														activeDate={new Date()}
														date={new Date()}
														onSelect={function (date: Date): void {
															throw new Error('Function not implemented.')
														}}
													/> */}
												</Dialog.Content>
											</Dialog>
										</DropdownMenu.Item>
										<DropdownMenu.Item
											onClick={e => {
												e.stopPropagation()
											}}
										>
											Delete
										</DropdownMenu.Item>
										<DropdownMenu.Item className="text-lg" asChild>
											<Icon name="cross-1">Verwijderen</Icon>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu>
							</li>
						</NavLink>
					))}
			</ul>
			<Button variant="fab" autoFocus asChild>
				<Link to="new">
					<Icon name="plus" />
				</Link>
			</Button>
		</div>
	)
}
