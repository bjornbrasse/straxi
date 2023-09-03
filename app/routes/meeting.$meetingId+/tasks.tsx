import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { type DataFunctionArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
// import { useActionData, useLoaderData } from '@remix-run/react'

export async function loader({ request }: DataFunctionArgs) {
	return null
}

export async function action({ request }: DataFunctionArgs) {
	return null
}

export default function MeetingTasksRoute() {
	// const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="h-full p-4">
			<h2>MeetingTasksRoute</h2>
			<Button variant="fab" asChild>
				<Link to="new">
					<Icon name="plus" />
				</Link>
			</Button>
		</div>
	)
}
