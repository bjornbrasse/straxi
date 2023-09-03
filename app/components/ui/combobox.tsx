import { useCombobox } from 'downshift'
import { cn } from '#app/utils/misc.tsx'

export function Combobox({
	items,
}: {
	items: Array<{ value: string; caption: string }>
}) {
	// const [items, setItems] = React.useState(books)
	const {
		isOpen,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		selectedItem,
	} = useCombobox({
		onInputValueChange({ inputValue }) {
			// setItems(books.filter(getBooksFilter(inputValue)))
		},
		items,
		itemToString(item) {
			return item ? item.caption : ''
		},
	})

	return (
		<div>
			<div className="flex w-72 flex-col gap-1">
				<label className="w-fit" {...getLabelProps()}>
					Choose your favorite book:
				</label>
				<div className="flex gap-0.5 bg-white shadow-sm">
					<input
						placeholder="Best book ever"
						className="w-full p-1.5"
						{...getInputProps()}
					/>
					<button
						aria-label="toggle menu"
						className="px-2"
						type="button"
						{...getToggleButtonProps()}
					>
						{isOpen ? <>&#8593;</> : <>&#8595;</>}
					</button>
				</div>
			</div>
			<ul
				className={`absolute z-10 mt-1 max-h-80 w-72 overflow-scroll bg-white p-0 shadow-md ${
					!(isOpen && items.length) && 'hidden'
				}`}
				{...getMenuProps()}
			>
				{isOpen &&
					items.map((item, index) => (
						<li
							className={cn(
								highlightedIndex === index && 'bg-blue-300',
								selectedItem === item && 'font-bold',
								'flex flex-col px-3 py-2 shadow-sm',
							)}
							key={`${item.value}${index}`}
							{...getItemProps({ item, index })}
						>
							<span>{item.caption}</span>
						</li>
					))}
			</ul>
		</div>
	)
}
