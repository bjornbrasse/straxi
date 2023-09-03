import { TaskForm } from './tasks_+/__task-form.tsx'

export { action } from '#app/routes/_app+/tasks_+/__task-form.tsx'

export default function NewTaskRoute() {
	return (
		<div className="h-full p-12">
			<h1>NewTaskRoute</h1>
			<TaskForm />
		</div>
	)
}
