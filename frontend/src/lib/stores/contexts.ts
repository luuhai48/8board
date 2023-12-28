import { writable } from 'svelte/store';

export default writable<{
	contexts: {
		name: string;
		namespace?: string;
	}[];
	currentContext: string;
	currentNamespace: string;
}>({
	contexts: [],
	currentContext: '',
	currentNamespace: 'default'
});
