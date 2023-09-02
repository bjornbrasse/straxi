import { Link } from '@remix-run/react'
import { Icon } from '#app/components/ui/icon.tsx'

export default function MeetingAppointments() {
	return (
		<div className="h-full bg-emerald-300">
			<h1>Afspraken</h1>
			<Link to="new">
				<Icon name="plus" />
			</Link>
		</div>
	)
}
