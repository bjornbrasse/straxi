import { useFetcher } from '@remix-run/react'
import { Icon } from './ui/icon.tsx'

export function Tab({ tab }: { tab: { id: string; name: string } }) {
	const fetcher = useFetcher()
	return (
		<div className="flex overflow-x-hidden text-ellipsis whitespace-nowrap rounded-t-md bg-blue-500 px-2 pb-1 pt-2 text-white">
			<span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
				{tab.name}
			</span>
			<fetcher.Form action="/api/tab" method="POST">
				<input type="hidden" name="id" value={tab.id} />
				<button type="submit" name="intent" value="closeTab" className="ml-2">
					<Icon name="cross-1" />
				</button>
			</fetcher.Form>
		</div>
	)
}
