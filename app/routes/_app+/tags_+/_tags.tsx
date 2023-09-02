import { type DataFunctionArgs } from '@remix-run/node'
// import { useActionData, useLoaderData } from '@remix-run/react'

export async function loader({ request }: DataFunctionArgs) {
	return null
}

export async function action({ request }: DataFunctionArgs) {
	return null
}

export default function TagsRoute() {
	// const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="p-4">
			<h1>TagsRoute</h1>
		</div>
	)
}
