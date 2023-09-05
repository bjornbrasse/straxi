import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import weekday from 'dayjs/plugin/weekday.js'
import * as React from 'react'
import { MONTHS, DAYS } from '#app/utils/date-time.ts'
import { cn } from '#app/utils/misc.tsx'

dayjs.extend(weekday)
dayjs.extend(utc)

export function DateSelector({
	activeDate,
	date,
	onSelect,
}: {
	activeDate: Date
	date: Date
	onSelect: (date: Date) => void
}) {
	// function MenuButton({
	// 	className,
	// 	icon,
	// 	onClick: clickHandler,
	// }: {
	// 	className?: string
	// 	icon: string
	// 	onClick: () => void
	// }) {
	// 	return (
	// 		<button
	// 			onClick={clickHandler}
	// 			className={`rounded-md border border-gray-300 px-2 text-gray-300 hover:bg-blue-600 hover:text-white ${className}`}
	// 		>
	// 			<i className={icon} />
	// 		</button>
	// 	)
	// }

	function DateField({ date }: { date: Date }) {
		const isActiveDate = dayjs(date).isSame(activeDate, 'day')
		const isCurrentMonth = date.getMonth() === activeDate.getMonth()
		const isToday = dayjs(date).isSame(new Date(), 'day')

		return (
			<p
				onClick={() => onSelect(date)}
				className={cn(
					'select-none',
					isActiveDate
						? 'bg-blue-500 text-white'
						: 'cursor-pointer hover:bg-gray-200',
					isToday ? 'border-2 border-blue-900' : 'rounded-full',
					isCurrentMonth ? 'text-gray-800' : 'text-gray-300',
				)}
			>
				{dayjs(date).date()}
			</p>
		)
	}

	// const SelectMonthButton: React.FC<{ value: 'previous' | 'next' }> = ({
	// 	value,
	// }) => (
	// 	<MenuButton
	// 		icon={`fas fa-chevron-${value === 'previous' ? 'left' : 'right'}`}
	// 		// onClick={() =>
	// 		// 	setDate(
	// 		// 		dayjs(date)
	// 		// 			.add(value === 'next' ? 1 : -1, 'month')
	// 		// 			.toDate(),
	// 		// 	)
	// 		onClick={() =>
	// 			selectDateHandler(
	// 				dayjs(currentDate)
	// 					.add(value === 'next' ? 1 : -1, 'month')
	// 					.toDate(),
	// 			)
	// 		}
	// 	/>
	// );

	return (
		<>
			<div className="flex justify-between bg-gray-200">
				{/* <div className="flex">
					<SelectMonthButton value="previous" />
					{!dayjs(date).isSame(new Date(), 'month') && (
						<MenuButton
							className="ml-1"
							icon="fas fa-calendar-day"
							onClick={() => setDate(new Date())}
						/>
					)}
				</div> */}
				<div className="">
					<p className="select-none text-center font-bold">
						{MONTHS[dayjs(date).month()].name}
					</p>
					{/* <p className="ml-2 select-none text-center text-gray-400">
						{date.getFullYear()}
					</p> */}
				</div>
				{/* <SelectMonthButton value="next" /> */}
			</div>
			<div className="grid grid-cols-7 border-b border-gray-400">
				{DAYS.map((_, i) => (
					<p className="select-none text-center" key={i}>
						{DAYS[(i + 8) % 7].short}
					</p>
				))}
			</div>
			<div className="lg:text-md grid grid-cols-7 items-center justify-center text-center text-lg">
				{Array.from(
					{ length: (dayjs(date).startOf('month').day() + 6) % 7 },
					(_, index) => dayjs(dayjs(date).startOf('month')).add(index, 'days'),
				).map((day, i) => (
					// <DateField
					// 	activeDate={dayjs(day).toDate()}
					// 	date={day.toDate()}
					// 	key={i}
					// 	// onSelect={selectDateHandler}
					// 	onSelect={onSelect}
					// />
					<div key={i}></div>
				))}
				{Array.from({ length: dayjs(date).daysInMonth() }, (_, index) =>
					dayjs(dayjs(date).startOf('month')).add(index, 'days'),
				).map((day, i) => (
					<DateField date={day.toDate()} key={i} />
				))}
				{/* {nextMonthDays.map((day, i) => (
					<DateField
						activeDate={currentDate}
						date={day.toDate()}
						key={i}
						// onSelect={selectDateHandler}
						onSelect={date => setCurrentDate(date)}
					/>
				))} */}
			</div>
		</>
	)
}
