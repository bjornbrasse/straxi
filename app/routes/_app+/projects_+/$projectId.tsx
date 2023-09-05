import { json, type DataFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { NavTab } from '#app/components/navtab.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { DropdownMenu } from '#app/components/ui/dropdown-menu_new.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { cn, invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: DataFunctionArgs) {
	const project = await prisma.project.findUnique({
		where: { id: params.projectId },
		select: { id: true, name: true, followUpDate: true },
	})
	invariantResponse(project, 'Project not found', {
		headers: {
			Location: '/projects',
		},
	})
	return json({ project })
}

const FormSchema = z.discriminatedUnion('intent', [
	z.object({ intent: z.literal('delete'), projectId: z.string().cuid() }),
])

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const result = FormSchema.safeParse(Object.fromEntries(formData))
	invariantResponse(result.success, 'Error parsing request')
	if (result.data.intent === 'delete') {
		const project = await prisma.project.delete({
			where: { id: result.data.projectId },
		})
		invariantResponse(project, 'Project not deleted')
		return redirect('/projects')
	}
}

export default function ProjectRoute() {
	const data = useLoaderData<typeof loader>()
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setLoaded(true)
		}, 100)
	}, [])

	return (
		<div className="flex h-full w-full flex-col border-t border-indigo-800">
			<div
				className={cn(
					'absolute -top-12 z-50 ml-[70px] flex gap-1 border-2 border-red-600',
					{
						'-translate-y-[52px] transform duration-500': loaded,
					},
				)}
			>
				<NavTab caption={''} iconName={'arrow-left'} to="test" />
				<NavTab caption="Taken" iconName="lightning-bolt" to="tasks" />
				<NavTab
					caption="Gebruikers"
					iconName="lightning-bolt"
					to="appointments"
				/>
			</div>
			<div className="flex items-center justify-between bg-gray-100 py-2 pl-4 pr-1">
				<div className="flex flex-col">
					<h2>{data.project.name}</h2>

					{data.project.followUpDate ? (
						<p>`${dayjs(data.project.followUpDate).format("D MMM 'YY")}`</p>
					) : (
						<p className="text-blue-700 underline">Kies een opvolgdatum</p>
					)}
				</div>
				<div className="flex gap-1">
					<Button size="sm" asChild>
						<Link to="edit">
							<Icon name="pencil-1" />
						</Link>
					</Button>

					<DropdownMenu>
						<DropdownMenu.Trigger asChild>
							<Button variant="transparent" size="sm">
								<Icon name="dots-vertical" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Item asChild>
								<Button size="sm" asChild>
									<Link to="/projects">
										<Icon name="cross-1" />
									</Link>
								</Button>
							</DropdownMenu.Item>
							<DropdownMenu.Item asChild>
								<Form method="POST">
									<input
										type="hidden"
										name="projectId"
										value={data.project.id}
									/>
									<Button
										type="submit"
										name="intent"
										value="delete"
										variant="transparent"
									>
										<Icon name="trash" />
										Verwijderen
									</Button>
								</Form>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu>
				</div>
			</div>
			<div className="flex-1 overflow-y-hidden">
				<Outlet />
			</div>
		</div>
	)
}
