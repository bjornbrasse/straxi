export const dayjsCustomLocaleNL = {
	months: [
		'januari',
		'februari',
		'maart',
		'april',
		'mei',
		'juni,',
		'juli',
		'augustus',
		'september',
		'oktober',
		'november',
		'december',
	],
	monthsShort: [
		'jan',
		'feb',
		'mrt',
		'apr',
		'mei',
		'jun',
		'jul',
		'aug',
		'sep',
		'okt',
		'nov',
		'dec',
	],
	weekdays: [
		'zondag',
		'maandag',
		'dinsdag',
		'woensdag',
		'donderdag',
		'vrijdag',
		'zaterdag',
	],
	weekdaysMin: ['Zo', 'M', 'D', 'W', 'D', 'V', 'Za'],
	weekdaysShort: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
};

export function dateWithoutTime(date: Date) {
	date.setUTCHours(24, 0, 0, 0);
	return date;
}

export class DateRange {
	constructor(
		private startDate: Date | string,
		private endDate: Date | string,
	) {
		this.getUTCDate = this.getUTCDate.bind(this);
		this.getDateRange = this.getDateRange.bind(this);
	}

	getUTCDate(date: Date): Date {
		const year = date.getUTCFullYear();
		const month = date.getUTCMonth();
		const day = date.getUTCDate();
		return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
	}

	// getDateRange(options?: { toISOString: boolean }) {
	getDateRange() {
		const range: Date[] = [];
		const currentDate = this.getUTCDate(new Date(this.startDate));

		while (currentDate <= this.getUTCDate(new Date(this.endDate))) {
			range.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		// return options?.toISOString ? range.map(date => date.toISOString()) : range;
		return range;
	}
}

export const MONTHS: Array<{ name: string; short: string }> = [
	{ name: 'januari', short: 'jan' },
	{ name: 'februari', short: 'feb' },
	{ name: 'maart', short: 'mrt' },
	{ name: 'april', short: 'apr' },
	{ name: 'mei', short: 'mei' },
	{ name: 'juni', short: 'jun' },
	{ name: 'juli', short: 'jul' },
	{ name: 'augustus', short: 'aug' },
	{ name: 'september', short: 'sep' },
	{ name: 'oktober', short: 'okt' },
	{ name: 'november', short: 'nov' },
	{ name: 'december', short: 'dec' },
];

export const DAYS: Array<{
	name: { eng: string; nl: string };
	short: string;
	abbr: { eng: string; nl: string };
}> = [
	{
		name: { eng: 'sunday', nl: 'zondag' },
		short: 'zo',
		abbr: { eng: '', nl: 'Zo' },
	},
	{
		name: { eng: 'monday', nl: 'maandag' },
		short: 'ma',
		abbr: { eng: '', nl: 'M' },
	},
	{
		name: { eng: 'tuesday', nl: 'dinsdag' },
		short: 'di',
		abbr: { eng: '', nl: 'Di' },
	},
	{
		name: { eng: 'wednesday', nl: 'woensdag' },
		short: 'wo',
		abbr: { eng: '', nl: 'W' },
	},
	{
		name: { eng: 'thursday', nl: 'donderdag' },
		short: 'do',
		abbr: { eng: '', nl: 'Do' },
	},
	{
		name: { eng: 'friday', nl: 'vrijdag' },
		short: 'vr',
		abbr: { eng: '', nl: 'V' },
	},
	{
		name: { eng: 'saturday', nl: 'zaterdag' },
		short: 'za',
		abbr: { eng: '', nl: 'Za' },
	},
];

export function getUTCDate(date: Date): Date {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();
	const day = date.getUTCDate();
	return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}
