import { ContactForm } from './contacts_+/__contact-form.tsx'

export { action } from './contacts_+/__contact-form.tsx'

export default function NewContactRoute() {
	return (
		<div className="h-full p-12">
			<h2>ContactNewRoute</h2>
			<ContactForm />
		</div>
	)
}
