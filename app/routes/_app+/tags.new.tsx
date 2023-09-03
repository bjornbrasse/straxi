import { TagForm } from './tags_+/__tag-form.tsx'

export { action } from '#app/routes/_app+/tasks_+/__task-form.tsx'

export default function NewTagRoute() {
	return (
		<div className="h-full p-12">
			<h1>NewTagRoute</h1>
			<TagForm />
		</div>
	)
}
