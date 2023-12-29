import { writable } from 'svelte/store';
import loading from './loading';

const error = writable('');

const promptError = (err: string) => {
	error.set(err);
	loading.set(false);
};

export { error, promptError };
