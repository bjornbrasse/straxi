import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type ContactEmail, type Contact } from '@prisma/client'
import {
	json,
	redirect,
	type DataFunctionArgs,
	type SerializeFrom,
} from '@remix-run/node'
import { Form, useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'

const ContactSchema = z.object({
	id: z.string().optional(),
	firstName: z.string().min(2).max(100),
	lastName: z.string().min(2).max(100),
	emails: z.array(z.object({ id: z.string(), email: z.string().email() })),
})

export async function action({ params, request }: DataFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await request.formData()
	const submission = await parse(formData, {
		schema: ContactSchema.superRefine(async ({ id }, ctx) => {
			if (!id) return

			const Contact = await prisma.contact.findUnique({
				where: { id },
				select: { id: true },
			})
			if (!Contact) {
				ctx.addIssue({
					code: 'custom',
					message: 'Contact not found',
				})
			}
		}),
		async: true,
	})

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const)
	}

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	const { id, emails, ...data } = submission.value
	console.log(
		'🚀 ~ file: __contact-form.tsx:56 ~ action ~ value:',
		submission.value,
	)

	const contact = await prisma.contact.upsert({
		where: { id: id ?? '__new_contact__' },
		create: {
			...data,
			emails: { create: emails.map(email => ({ ...email })) },
			createdById: userId,
		},
		update: {
			...data,
		},
		select: { id: true },
	})

	if (!contact) {
		return json({ status: 'error', submission } as const, { status: 400 })
	}

	return redirect(`/contacts/${contact.id}`)
}

export function ContactForm({
	contact,
}: {
	contact?: SerializeFrom<
		Pick<Contact, 'id' | 'firstName' | 'lastName'> & {
			emails: Array<Pick<ContactEmail, 'id' | 'email'>>
		}
	>
}) {
	const fetcher = useFetcher<typeof action>()
	const isPending = fetcher.state !== 'idle'
	const [editEmails, setEditEmails] = useState<
		Array<{ id?: string; email: string }>
	>([])

	const [form, fields] = useForm({
		id: 'test-action-editor',
		constraint: getFieldsetConstraint(ContactSchema),
		lastSubmission: fetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: ContactSchema })
		},
		defaultValue: {
			firstName: contact?.firstName ?? '',
			lastName: contact?.lastName ?? '',
			// email: contact?.email ?? '',
		},
	})

	return (
		<Form
			method="POST"
			className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-4 sm:gap-4"
			{...form.props}
		>
			{contact ? <input type="hidden" name="id" value={contact.id} /> : null}

			{/*
					This hidden submit button is here to ensure that when the user hits
					"enter" on an input field, the primary form function is submitted
					rather than the first button in the form (which is delete/add image).
				*/}
			<button type="submit" className="hidden" />

			<Field
				labelProps={{ children: 'Voornaam:' }}
				inputProps={{
					autoFocus: true,
					...conform.input(fields.firstName, { ariaAttributes: true }),
				}}
				errors={fields.firstName.errors}
			/>
			<Field
				labelProps={{ children: 'Achternaam:' }}
				inputProps={{
					...conform.input(fields.lastName, { ariaAttributes: true }),
				}}
				errors={fields.lastName.errors}
			/>
			{editEmails.map((email, index) => (
				<div className="flex justify-between" key={index}>
					<Label>Email {index + 1}</Label>
					<Input type="email" name="email" id="email" key={email.id} />
					{index > 0 && (
						<Button>
							<Icon name="cross-1" />
						</Button>
					)}
				</div>
			))}
			<Button
				variant="default"
				onClick={e => {
					e.preventDefault()
					setEditEmails(prev => [{ email: '' }, ...prev])
				}}
			>
				Nog een email
			</Button>
			<ErrorList id={form.errorId} errors={form.errors} />
			<div>
				{/* <Button form={form.id} variant="destructive" type="reset">
					Reset
				</Button> */}
				<StatusButton
					form={form.id}
					type="submit"
					disabled={isPending}
					status={isPending ? 'pending' : 'idle'}
				>
					Opslaan
				</StatusButton>
			</div>
		</Form>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No note with the id "{params.noteId}" exists</p>
				),
			}}
		/>
	)
}
