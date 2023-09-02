import { redirect, type DataFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUserId } from '#app/utils/auth.server.ts'

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

	return json({
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
	const { date } = useLoaderData<typeof loader>()

	return (
		<main className="flex h-full flex-col">
			<div id="header" className="px-4 py-1">
				<h1>Kalender</h1>
				<p>{date}</p>
			</div>
			<div className="flex h-full flex-1 flex-col">
				<section className="flex-1 border border-red-400">
					<h2>Afspraken</h2>
				</section>
				<section className="flex-1 border border-blue-400">
					<div className="justify-between bg-gray-300 px-4 py-1.5 text-xl font-bold text-indigo-800">
						<h2>Taken</h2>
					</div>
				</section>
			</div>
		</main>
	)
}
