import hljs from 'highlight.js';

export function timestampToHumanReadable(milliseconds: number | Date, additional = false) {
	if (milliseconds === undefined || milliseconds === null) return '';

	if (typeof milliseconds === 'string') {
		try {
			milliseconds = Date.parse(milliseconds);
		} catch {
			return '';
		}
	}

	if (milliseconds instanceof Date) {
		milliseconds = milliseconds.getTime();
	}

	milliseconds = Date.now() - milliseconds;

	let temp = Math.floor(milliseconds / 1000);
	const years = Math.floor(temp / 31536000);
	if (years) {
		const days = Math.floor(milliseconds / 86400000) - years * 365;
		if (!additional || days < 1) {
			return years + 'y';
		}
		return years + 'y' + days + 'd';
	}

	const days = Math.floor((temp %= 31536000) / 86400);
	if (days) {
		const hours = Math.floor(milliseconds / 3600000) - days * 24;
		if (!additional || hours < 1) {
			return days + 'd';
		}
		return days + 'd' + hours + 'h';
	}

	const hours = Math.floor((temp %= 86400) / 3600);
	if (hours) {
		const minutes = Math.floor(milliseconds / 60000) - hours * 60;
		if (!additional || minutes < 1) {
			return hours + 'h';
		}
		return hours + 'h' + minutes + 'm';
	}

	const minutes = Math.floor((temp %= 3600) / 60);
	if (minutes) {
		return minutes + 'm';
	}

	const seconds = temp % 60;
	if (seconds) {
		return seconds + 's';
	}
	return 'Just now';
}

export function highlight(text: string, language: string) {
	return hljs.highlight(text, { language }).value;
}
