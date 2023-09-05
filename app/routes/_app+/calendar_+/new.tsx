import { type DataFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { AppointmentForm } from './__appointment-form.tsx'
// import { useActionData, useLoaderData } from '@remix-run/react'

export async function loader({ request }: DataFunctionArgs) {
	return null
}

export default function CalendarNewAppointmentRoute() {
	// const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()
	const appointmentFetcher = useFetcher()

	return (
		<div className="h-full p-12">
			<h1>CalendarNewAppointmentRoute</h1>
			<AppointmentForm fetcher={appointmentFetcher} />
		</div>
	)
}
