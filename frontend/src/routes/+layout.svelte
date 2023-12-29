<script lang="ts">
	import '../app.pcss';
	import '../../node_modules/highlight.js/styles/atom-one-light.css';

	import { onMount } from 'svelte';
	import {
		GetContexts,
		GetNamespaces,
		GetVersion,
		ReloadConfig,
		SetCurrentContext,
		SetCurrentNamespace
	} from '$lib/wailsjs/go/main/App.js';
	import { page } from '$app/stores';

	import Modal from '$lib/components/modal.svelte';
	import Spinner from '$lib/components/spinner.svelte';

	import contexts from '$lib/stores/contexts';
	import namespaces from '$lib/stores/namespaces';
	import { error } from '$lib/stores/error';
	import loading from '$lib/stores/loading';
	import { goto } from '$app/navigation';

	let version = '';
	GetVersion().then((v) => {
		version = v;
	});

	let showError = false;

	error.subscribe((val) => {
		if (val !== '') {
			showError = true;
		} else {
			showError = false;
		}
	});

	const promptError = (err: string) => {
		$error = err;
		$loading = false;
	};

	const reloadConfig = async () => {
		$error = '';
		$loading = true;
		const err = await ReloadConfig();

		if (err !== '') {
			return promptError(err);
		}

		const cls = await GetContexts();
		if (cls.err !== '') {
			return promptError(cls.err);
		}
		$contexts = {
			contexts: cls.contexts,
			currentContext: cls.currentContext,
			currentNamespace:
				cls.contexts.find((c) => c.name === cls.currentContext)?.namespace || 'default'
		};
		$namespaces = {
			namespaces: []
		};

		const ns = await GetNamespaces();
		if (ns.err !== '') {
			return promptError(ns.err);
		}
		$namespaces = {
			namespaces: ns.namespaces
		};
		goto('/');
		$loading = false;
	};

	const selectContext = async (
		e: Event & {
			currentTarget: HTMLSelectElement;
		}
	) => {
		$loading = true;
		const err = await SetCurrentContext(e.currentTarget.value);

		if (err !== '') {
			return promptError(err);
		}

		reloadConfig();
	};

	const selectNamespace = async (e: Event & { currentTarget: HTMLSelectElement }) => {
		$loading = true;
		const err = await SetCurrentNamespace(e.currentTarget.value);

		if (err !== '') {
			return promptError(err);
		}

		reloadConfig();
	};

	onMount(() => {
		reloadConfig();
	});
</script>

{#if $loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-70">
		<Spinner />
	</div>
{/if}

<nav class="absolute left-0 right-0 top-0 z-10 flex items-center px-5 py-3 shadow-md">
	<a href="/">
		<img src="/8board.png" alt="Logo" class="h-10 w-10" />
	</a>

	<span class="ml-auto text-gray-600">Version: {version}</span>
</nav>

<main class="flex h-full pt-16">
	<div class="w-80 border-r border-gray-200 p-3">
		<label for="contexts" class="mt-4 block text-sm font-semibold">Context</label>
		<select
			id="contexts"
			class="mt-2 w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-gray-900 shadow-md"
			on:change={selectContext}
		>
			<option value="" disabled selected>-- Context --</option>
			{#each $contexts.contexts as context}
				<option
					value={context.name}
					selected={$contexts.currentContext !== '' && context.name === $contexts.currentContext}
					>{context.name}</option
				>
			{/each}
		</select>

		<label for="contexts" class="mt-6 block text-sm font-semibold">Namespace</label>
		<select
			id="contexts"
			class="mt-2 w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-gray-900 shadow-md"
			on:change={selectNamespace}
		>
			<option value="" disabled selected>-- Namespace --</option>
			{#each $namespaces.namespaces as namespace}
				<option
					value={namespace}
					selected={$contexts.currentNamespace !== '' && namespace === $contexts.currentNamespace}
					>{namespace}</option
				>
			{/each}
		</select>

		<div class="mt-8 space-y-4">
			<a
				href="/secrets"
				class={'trasition-all block rounded-lg px-2 py-1.5 hover:bg-gray-100 ' +
					($page.url.pathname.startsWith('/secrets') ? 'bg-gray-100 hover:bg-gray-200' : '')}
				>Secrets</a
			>
		</div>
	</div>

	<div
		class="relative flex w-full overflow-y-auto overflow-x-hidden"
		style="max-height: calc(100vh - 4rem)"
	>
		<slot />
	</div>
</main>

<Modal bind:showModal={showError}>
	<h2 slot="header">Error</h2>

	<div class="pt-5">
		<h1>{$error}</h1>

		<small class="text-xs">
			<b>Note: </b>If you having error, try updating <b>PATH</b> variable in config file at
			<i>~/.8board/config.json</i>
		</small>
	</div>
</Modal>
