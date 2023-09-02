import * as RadixDialog from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { cn } from '#app/utils/misc.tsx'

export function Dialog({
	children,
	...props
}: {
	children: ReactNode
} & RadixDialog.DialogProps) {
	return <RadixDialog.Root {...props}>{children}</RadixDialog.Root>
}

Dialog.Close = RadixDialog.Close
Dialog.Content = DialogContent
Dialog.Description = RadixDialog.Description
Dialog.Title = RadixDialog.Title
Dialog.Trigger = RadixDialog.Trigger

function DialogContent({
	children,
	className,
	...props
}: { children: ReactNode } & RadixDialog.DialogContentProps) {
	return (
		<RadixDialog.Portal>
			<RadixDialog.Overlay className="z-dialog-overlay fixed inset-0 bg-black/50" />
			<RadixDialog.Content
				className={cn(
					'z-dialog-content fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white',
					className,
				)}
				{...props}
			>
				{children}

				<RadixDialog.Close asChild>
					<button
						className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-primary hover:text-white"
						aria-label="Close"
					>
						<i className="fas fa-times"></i>
					</button>
				</RadixDialog.Close>
			</RadixDialog.Content>
		</RadixDialog.Portal>
	)
}
