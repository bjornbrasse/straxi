import { TaskForm } from '#app/routes/_app+/tasks_+/__task-form.tsx'

export { action } from '#app/routes/_app+/tasks_+/__task-form.tsx'

export default function NewTaskRoute() {
	return (
		<div className="h-full bg-red-200 p-4">
			<h2>NewTaskRoute</h2>
			<TaskForm />
		</div>
	)
}
