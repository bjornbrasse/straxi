import * as RadixDialog from '@radix-ui/react-dialog'
import { json, type DataFunctionArgs } from '@remix-run/node'
import {
	// Form,
	Link,
	Outlet,
	useLoaderData,
	type V2_MetaFunction,
} from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { cn, getUserImgSrc, invariantResponse } from '#app/utils/misc.tsx'
import { useOptionalUser } from '#app/utils/user.ts'

export async function loader({ params }: DataFunctionArgs) {
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

export default function ProfileRoute() {
	const data = useLoaderData<typeof loader>()
	const user = data.user
	const userDisplayName = user.name ?? user.username
	const loggedInUser = useOptionalUser()
	const isLoggedInUser = data.user.id === loggedInUser?.id

	return (
		<div className="mb-48 flex flex-col gap-8">
			<div className="relative h-24 w-full rounded-md bg-accent py-4 pl-12 pr-4">
				<Link
					to={isLoggedInUser ? '/settings/profile/photo' : '.'}
					className={cn(!isLoggedInUser && 'cursor-default')}
				>
					<img
						src={getUserImgSrc(data.user.image?.id)}
						alt={userDisplayName}
						className="absolute -left-8 top-4 h-16 w-16 rounded-full border border-gray-400 object-cover"
					/>
				</Link>
				<div className="flex justify-between">
					<div className="flex flex-col">
						<h1>Hahaha {data.user.name}</h1>
						<p className="text-gray-400">Lid sinds: {data.userJoinedDisplay}</p>
					</div>
					{isLoggedInUser && (
						<div className="flex gap-2">
							<Button asChild>
								<Link to="/settings/profile" prefetch="intent">
									Edit profile
								</Link>
							</Button>
							{/* <Form action="/logout" method="POST">
								<Button type="submit" variant="default" size="default">
									<Icon name="exit" className="scale-125 max-md:scale-150">
										Logout
									</Icon>
								</Button>
							</Form> */}
						</div>
					)}
				</div>
			</div>
			<div>
				<h1>Rollen</h1>
				<span>{data.user.roles.map(r => r.name).join(', ')}</span>
				<RadixDialog.Root>
					<RadixDialog.Trigger asChild>
						<Button>
							<Icon name="pencil-1" />
						</Button>
					</RadixDialog.Trigger>
					<RadixDialog.Portal>
						<RadixDialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />
						<RadixDialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
							<RadixDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
								Rollen
							</RadixDialog.Title>
							{/* <RadixDialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal">
								Make changes to your profile here. Click save when you're done.
							</RadixDialog.Description> */}

							<div className="mt-[25px] flex justify-end">
								<RadixDialog.Close asChild>
									<button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
										Save changes
									</button>
								</RadixDialog.Close>
							</div>
							<RadixDialog.Close asChild>
								<button
									className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-indigo-700 hover:bg-indigo-300 focus:shadow-[0_0_0_2px] focus:shadow-indigo-300 focus:outline-none"
									aria-label="Close"
								>
									<Icon name="cross-1" />
								</button>
							</RadixDialog.Close>
						</RadixDialog.Content>
					</RadixDialog.Portal>
				</RadixDialog.Root>
			</div>
			{/* <div className="border-4 border-red-500">
				{isLoggedInUser ? (
					<Form action="/logout" method="POST" className="mt-3">
						<Button type="submit" variant="link" size="pill">
							<Icon name="exit" className="scale-125 max-md:scale-150">
								Logout
							</Icon>
						</Button>
					</Form>
				) : null}
			</div> */}
			<Outlet />
		</div>
	)
}

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
	const displayName = data?.user.name ?? params.username
	return [
		{ title: `${displayName} | Epic Notes` },
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
