import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { Combobox } from '#app/components/ui/combobox.tsx'
import { type loader } from '#app/routes/api+/tag.ts'

export function TagCombobox() {
	const fetcher = useFetcher<typeof loader>()

	useEffect(() => {
		fetcher.load('/api/tag')
	}, [])

	return (
		<Combobox
			items={
				fetcher?.data?.tags
					? fetcher.data.tags.map(tag => ({ value: tag.id, caption: tag.name }))
					: []
			}
		/>
	)
}
