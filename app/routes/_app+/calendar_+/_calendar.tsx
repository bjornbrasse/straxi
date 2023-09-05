import { redirect, type DataFunctionArgs, json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Button } from '#app/components/ui/button.tsx'
import { Dialog } from '#app/components/ui/dialog.tsx'
import { DropdownMenu } from '#app/components/ui/dropdown-menu_new.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { AppointmentForm, action } from './__appointment-form.tsx'

export { action }

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

	const appointments = await prisma.appointment.findMany({
		select: { id: true, subject: true, start: true, end: true },
	})

	return json({
		appointments,
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
	const data = useLoaderData<typeof loader>()
	const appointmentFetcher = useFetcher()

	const [showAppointmentEditDialog, setShowAppointmentEditDialog] =
		useState(false)

	return (
		<main className="relative flex h-full flex-col">
			<div id="header" className="px-4 py-1">
				<h1>Kalender</h1>
				<p>{data.date}</p>
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
								<AppointmentForm fetcher={appointmentFetcher} />
							</Dialog.Content>
						</Dialog>
					</div>
					<div className="flex flex-col gap-2 overflow-y-auto p-2">
						{data.appointments.map(appointment => (
							<div
								className="flex justify-between rounded-md bg-accent px-2 py-1"
								key={appointment.id}
							>
								<div className="">
									<h2>{appointment.subject}</h2>
									<span className="text-sm">{`${dayjs(appointment.start).format(
										"D MMM 'YY",
									)} ${dayjs(appointment.start).format('H:mm')}`}</span>
									<p>{appointment.end}</p>
								</div>
								<Dialog
									open={showAppointmentEditDialog}
									onOpenChange={setShowAppointmentEditDialog}
								>
									<Dialog.Trigger asChild>
										<Button size="sm">
											<Icon name="pencil-1" />
										</Button>
									</Dialog.Trigger>
									<Dialog.Content>
										<AppointmentForm
											appointment={appointment}
											fetcher={appointmentFetcher}
										/>
									</Dialog.Content>
								</Dialog>
							</div>
						))}
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
