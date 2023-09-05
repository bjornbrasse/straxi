import { type DataFunctionArgs } from '@remix-run/node'
import { AppointmentForm } from '../_app+/calendar_+/__appointment-form.tsx'
// import { useActionData, useLoaderData } from '@remix-run/react'

export async function loader({ request }: DataFunctionArgs) {
	return null
}

export { action } from '#app/routes/_app+/calendar_+/__appointment-form.tsx'

export default function Route() {
	// const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="h-full p-12">
			<h1>Route</h1>
			<AppointmentForm />
		</div>
	)
}
