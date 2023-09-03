import { useFetcher } from '@remix-run/react'
import { type UseComboboxStateChange } from 'downshift'
import { useEffect } from 'react'
import { Combobox } from '#app/components/ui/combobox.tsx'
import { type loader } from '#app/routes/api+/tag.ts'

export function TagCombobox({
	onInputValueChange,
	onSelectedItemChange,
}: {
	onInputValueChange?: (
		changes: UseComboboxStateChange<{ value: string; caption: string }>,
	) => void
	onSelectedItemChange?: (
		changes: UseComboboxStateChange<{ value: string; caption: string }>,
	) => void
}) {
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
			labelText="Select labels"
			onInputValueChange={onInputValueChange}
			onSelectedItemChange={onSelectedItemChange}
			placeholder="Labels zoeken"
		/>
	)
}
