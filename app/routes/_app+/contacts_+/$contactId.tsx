import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData, type V2_MetaFunction } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params, request }: DataFunctionArgs) {
	await requireUserId(request)

	const user = await prisma.user.findFirst({
		where: {
			username: params.username,
		},
		select: {
			id: true,
			name: true,
			username: true,
			createdAt: true,
			image: { select: { id: true } },
			roles: { select: { id: true, name: true } },
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return json({ user, userJoinedDisplay: user.createdAt.toLocaleDateString() })
}

export default function ContactRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="h-full border-2 border-pink-700">
			<h1>Contact {data.user.name}</h1>
		</div>
	)
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
	const displayName = data?.user.name ?? params.username
	return [
		{ title: `Straxi | ${displayName} | Straxi` },
		{
			name: 'description',
			content: `Profile of ${displayName} on Epic Notes`,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No user with the username "{params.username}" exists</p>
				),
			}}
		/>
	)
}
