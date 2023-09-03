import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import * as React from 'react'

import { cn } from '#app/utils/misc.tsx'

export function DropdownMenu({
	children,
}: RadixDropdownMenu.DropdownMenuProps) {
	return <RadixDropdownMenu.Root>{children}</RadixDropdownMenu.Root>
}
DropdownMenu.Trigger = RadixDropdownMenu.Trigger
DropdownMenu.Group = RadixDropdownMenu.Group
DropdownMenu.Portal = RadixDropdownMenu.Portal
DropdownMenu.Sub = RadixDropdownMenu.Sub
DropdownMenu.RadioGroup = RadixDropdownMenu.RadioGroup

DropdownMenu.SubTrigger = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubTrigger> & {
		inset?: boolean
	}
>(({ className, inset, children, ...props }, ref) => (
	<RadixDropdownMenu.SubTrigger
		ref={ref}
		className={cn(
			'flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
			inset && 'pl-8',
			className,
		)}
		{...props}
	>
		{children}
		<span className="ml-auto h-4 w-4">▶️</span>
	</RadixDropdownMenu.SubTrigger>
))
DropdownMenu.SubTrigger.displayName = RadixDropdownMenu.SubTrigger.displayName

DropdownMenu.SubContent = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.SubContent>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubContent>
>(({ className, ...props }, ref) => (
	<RadixDropdownMenu.SubContent
		ref={ref}
		className={cn(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className,
		)}
		{...props}
	/>
))
DropdownMenu.SubContent.displayName = RadixDropdownMenu.SubContent.displayName

DropdownMenu.Content = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.Content>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<RadixDropdownMenu.Portal>
		<RadixDropdownMenu.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className,
			)}
			{...props}
		/>
	</RadixDropdownMenu.Portal>
))
DropdownMenu.Content.displayName = RadixDropdownMenu.Content.displayName

DropdownMenu.Item = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.Item>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => (
	<RadixDropdownMenu.Item
		ref={ref}
		className={cn(
			'relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			inset && 'pl-8',
			className,
		)}
		{...props}
	/>
))
DropdownMenu.Item.displayName = RadixDropdownMenu.Item.displayName

DropdownMenu.CheckboxItem = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<RadixDropdownMenu.CheckboxItem
		ref={ref}
		className={cn(
			'relative flex select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		checked={checked}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<RadixDropdownMenu.ItemIndicator>
				<span className="h-4 w-4">
					<svg viewBox="0 0 8 8">
						<path
							d="M1,4 L3,6 L7,2"
							stroke="black"
							strokeWidth="1"
							fill="none"
						/>
					</svg>
				</span>
			</RadixDropdownMenu.ItemIndicator>
		</span>
		{children}
	</RadixDropdownMenu.CheckboxItem>
))
DropdownMenu.CheckboxItem.displayName =
	RadixDropdownMenu.CheckboxItem.displayName

DropdownMenu.RadioItem = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.RadioItem>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
	<RadixDropdownMenu.RadioItem
		ref={ref}
		className={cn(
			'relative flex select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<RadixDropdownMenu.ItemIndicator>
				<span className="h-2 w-2">⚪</span>
			</RadixDropdownMenu.ItemIndicator>
		</span>
		{children}
	</RadixDropdownMenu.RadioItem>
))
DropdownMenu.RadioItem.displayName = RadixDropdownMenu.RadioItem.displayName

DropdownMenu.Label = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.Label>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => (
	<RadixDropdownMenu.Label
		ref={ref}
		className={cn(
			'px-2 py-1.5 text-sm font-semibold',
			inset && 'pl-8',
			className,
		)}
		{...props}
	/>
))
DropdownMenu.Label.displayName = RadixDropdownMenu.Label.displayName

DropdownMenu.Separator = React.forwardRef<
	React.ElementRef<typeof RadixDropdownMenu.Separator>,
	React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>
>(({ className, ...props }, ref) => (
	<RadixDropdownMenu.Separator
		ref={ref}
		className={cn('-mx-1 my-1 h-px bg-muted', className)}
		{...props}
	/>
))
DropdownMenu.Separator.displayName = RadixDropdownMenu.Separator.displayName

// DropdownMenu.Shortcut = ({
// 	className,
// 	...props
// }: React.HTMLAttributes<HTMLSpanElement>) => (
// 	<span
// 		className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
// 		{...props}
// 	/>
// )
// DropdownMenu.Shortcut.displayName = 'DropdownMenuShortcut'
