import {
	action,
	ProjectForm,
} from '#app/routes/_app+/projects_+/__project-form.tsx'

export { action }

export default function NewProjectRoute() {
	// const data = useLoaderData<typeof loader>()
	// const actionData = useActionData<typeof action>()

	return (
		<div className="h-full p-12">
			<h1>NewProjectRoute</h1>
			<ProjectForm />
		</div>
	)
}
