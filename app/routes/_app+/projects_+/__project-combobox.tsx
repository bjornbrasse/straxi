import { useFetcher } from '@remix-run/react'
import { type UseComboboxStateChange } from 'downshift'
import { useEffect } from 'react'
import { Combobox } from '#app/components/ui/combobox.tsx'
import { type loader } from '#app/routes/api+/project.ts'

export function ProjectCombobox({
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
		fetcher.load('/api/project')
	}, [])

	return (
		<Combobox
			items={
				fetcher?.data?.projects
					? fetcher.data.projects.map(project => ({
							value: project.id,
							caption: project.name,
					  }))
					: []
			}
			labelText="Select labels"
			onInputValueChange={onInputValueChange}
			onSelectedItemChange={onSelectedItemChange}
			placeholder="Labels zoeken"
		/>
	)
}
