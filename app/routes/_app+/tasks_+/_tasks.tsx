import { type DataFunctionArgs } from '@remix-run/node'
// import { useActionData, useLoaderData } from '@remix-run/react'

export async function loader({ request }: DataFunctionArgs) {
	return null
}

export async function action({ request }: DataFunctionArgs) {
	return null
}

export default function TasksRoute() {
	// const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="p-4">
			<h1>TasksRoute</h1>
		</div>
	)
}
