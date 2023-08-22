import { json, type DataFunctionArgs, redirect } from '@remix-run/node'
import { z } from 'zod'
import { sessionStorage } from '#app/utils/session.server.ts'

const TabSchema = z.discriminatedUnion('intent', [
	z.object({
		intent: z.literal('openTab'),
		id: z.string().cuid(),
		name: z.string(),
	}),
	z.object({ intent: z.literal('closeTab'), id: z.string().cuid() }),
])

export async function action({ request }: DataFunctionArgs) {
	const result = TabSchema.safeParse(
		Object.fromEntries(await request.formData()),
	)

	if (!result.success)
		return json({ errors: result.error.flatten() }, { status: 400 })

	if (result.data.intent === 'openTab') {
		const { intent, ...data } = result.data

		const cookieSession = await sessionStorage.getSession(
			request.headers.get('cookie'),
		)

		cookieSession.set('tabs', JSON.stringify([{ ...data }]))

		return redirect(`/meetings/${'cllmdbars0001yvugxn709upw'}`, {
			headers: {
				'set-cookie': await sessionStorage.commitSession(cookieSession),
			},
		})
	}

	if (result.data.intent === 'closeTab') {
		const { intent, ...data } = result.data

		const cookieSession = await sessionStorage.getSession(
			request.headers.get('cookie'),
		)

		const tabs = (JSON.parse(String(cookieSession.get('tabs') ?? null)) ??
			[]) as Array<{ id: string; name: string }>

		const newTabs = tabs.filter(tab => tab.id !== data.id)

		cookieSession.set('tabs', JSON.stringify(newTabs))

		return redirect(`/meetings`, {
			headers: {
				'set-cookie': await sessionStorage.commitSession(cookieSession),
			},
		})
	}
}
