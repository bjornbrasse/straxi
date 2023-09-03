import { type DataFunctionArgs } from '@remix-run/node'
import {
	useLoaderData,
	Link,
	NavLink,
	useParams,
	Outlet,
} from '@remix-run/react'
import { promiseHash } from 'remix-utils'
import { Button } from '#app/components/ui/button.tsx'
import { DropdownMenu } from '#app/components/ui/dropdown-menu_new.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn } from '#app/utils/misc.tsx'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	return promiseHash({
		tags: prisma.tag.findMany({
			where: { createdById: userId },
			select: { id: true, name: true },
		}),
	})
}

export default function TagsRoute() {
	const data = useLoaderData<typeof loader>()
	const { tagId } = useParams()

	return (
		<div className="relative flex h-full flex-col">
			<ul
				className={cn(
					'flex list-none flex-col gap-1 overflow-y-auto px-4 pb-16 pt-4',
					{ 'h-24': tagId, 'flex-1': !tagId },
				)}
			>
				{data.tags
					.sort((a, b) =>
						a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0,
					)
					.map(tag => (
						<NavLink
							to={tag.id}
							className={({ isActive }) =>
								cn('rounded-md bg-accent p-1', { 'bg-highlight': isActive })
							}
							key={tag.id}
						>
							<li className="flex items-center justify-between">
								{tag.name}
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
			{tagId ? (
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
