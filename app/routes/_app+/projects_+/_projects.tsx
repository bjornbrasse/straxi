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

	return (
		<div className="relative flex h-full flex-col">
			<ul
				className={cn(
					'flex list-none flex-col gap-1 overflow-y-auto px-4 pb-16 pt-4',
					{ hidden: projectId, 'flex-1': !projectId },
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
								cn('rounded-md bg-accent p-1', { 'bg-highlight': isActive })
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
										>
											<Dialog>
												<Dialog.Trigger>Set FollowUp Date</Dialog.Trigger>
												<Dialog.Content>
													<DateSelector
														activeDate={new Date()}
														date={new Date()}
														onSelect={function (date: Date): void {
															throw new Error('Function not implemented.')
														}}
													/>
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
			{projectId ? (
				<div className="flex-1">
					<Outlet />
				</div>
			) : (
				<Button variant="fab" autoFocus asChild>
					<Link to="new">
						<Icon name="plus" />
					</Link>
				</Button>
			)}
		</div>
	)
}
