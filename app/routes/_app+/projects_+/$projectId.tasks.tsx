import { type DataFunctionArgs } from '@remix-run/node'
// import { useActionData, useLoaderData } from '@remix-run/react'

export async function loader({ request }: DataFunctionArgs) {
	return null
}

export async function action({ request }: DataFunctionArgs) {
	return null
}

export default function ProjectTasksRoute() {
	// const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="h-full p-12">
			<h1>ProjectTasksRoute</h1>
		</div>
	)
}
