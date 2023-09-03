import { redirect, type DataFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { Button } from '#app/components/ui/button.tsx'
import { Dialog } from '#app/components/ui/dialog.tsx'
import { DropdownMenu } from '#app/components/ui/dropdown-menu_new.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { AppointmentEditor } from './__appointment-editor.tsx'

export async function loader({ request }: DataFunctionArgs) {
	await requireUserId(request)

	const url = new URL(request.url)
	const searchParams = url.searchParams

	if (!searchParams.get('date')) {
		const date = new Date()
		searchParams.set(
			'date',
			`${date.getFullYear()}-${date
				.getMonth()
				.toString()
				.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
		)
		return redirect(`${url.href}`)
	}

	const date = new Date(searchParams.get('date') ?? '')

	return json({
		date: `${
			[
				'zondag',
				'maandag',
				'dinsdag',
				'woensdag',
				'donderdag',
				'vrijdag',
				'zaterdag',
			][date.getDay()]
		} ${date.getDate()} ${
			[
				'januari',
				'februari',
				'maart',
				'april',
				'mei',
				'juni',
				'juli',
				'augustus',
				'september',
				'oktober',
				'november',
				'december',
			][date.getMonth()]
		} ${date.getFullYear()}`,
	})
}

export default function Index() {
	const { date } = useLoaderData<typeof loader>()

	return (
		<main className="relative flex h-full flex-col">
			<div id="header" className="px-4 py-1">
				<h1>Kalender</h1>
				<p>{date}</p>
			</div>
			<div className="flex h-full flex-1 flex-col">
				<section className="flex-1">
					<div className="flex items-center justify-between bg-gray-300 px-4 py-1.5 text-xl font-bold text-indigo-800">
						<h2>Afspraken</h2>
						<Dialog>
							<Dialog.Trigger className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
								<Icon name="plus" />
							</Dialog.Trigger>
							<Dialog.Content className="rounded-lg">
								{/* <Dialog.Close>
									<Button variant="outline" color="gray">
										Cancel
									</Button>
								</Dialog.Close> */}
								<AppointmentEditor />
							</Dialog.Content>
						</Dialog>
					</div>
				</section>
				<section className="flex-1">
					<div className="justify-between bg-gray-300 px-4 py-1.5 text-xl font-bold text-indigo-800">
						<h2>Taken</h2>
					</div>
				</section>
			</div>
			<DropdownMenu>
				<DropdownMenu.Trigger asChild>
					<Button variant="fab">
						<Icon name="plus" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item asChild>
						<Link prefetch="intent" to={`/meetings/new`}>
							<Icon className="text-body-md" name="chat-bubble">
								Vergaderingen
							</Icon>
						</Link>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu>
		</main>
	)
}
