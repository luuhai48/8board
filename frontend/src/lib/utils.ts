import hljs from 'highlight.js';

export function timestampToHumanReadable(milliseconds: number | Date) {
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
		return years + 'y';
	}
	const days = Math.floor((temp %= 31536000) / 86400);
	if (days) {
		return days + 'd';
	}
	const hours = Math.floor((temp %= 86400) / 3600);
	if (hours) {
		return hours + 'h';
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
