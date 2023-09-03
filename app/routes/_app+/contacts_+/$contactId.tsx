import { json, type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData, type V2_MetaFunction } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params, request }: DataFunctionArgs) {
	await requireUserId(request)

	const contact = await prisma.contact.findFirst({
		where: {
			id: params.contactId,
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			// image: { select: { id: true } },
		},
	})

	invariantResponse(contact, 'Contact not found', { status: 404 })

	return json({
		contact: {
			...contact,
			fullName: `${contact.firstName} ${contact.lastName}`,
		},
	})
}

export default function ContactRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="flex h-full justify-between border-2 border-blue-700 px-4 py-1">
			<h3>{data.contact.fullName}</h3>
			<Link to="/contacts">
				<Icon name="cross-1" />
			</Link>
		</div>
	)
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
	return [
		{ title: data?.contact ? `Straxi | ${data?.contact.fullName}` : 'Straxi' },
		{
			name: 'description',
			content: `Profile of ${data?.contact.fullName} on Epic Notes`,
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
