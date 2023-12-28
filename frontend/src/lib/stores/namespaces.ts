import { writable } from 'svelte/store';

export default writable<{
	namespaces: string[];
}>({
	namespaces: []
});
