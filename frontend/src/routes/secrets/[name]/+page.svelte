<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ArrowLeftCircle, DocumentDuplicate, Icon } from 'svelte-hero-icons';

	import contexts from '$lib/stores/contexts';
	import loading from '$lib/stores/loading';
	import { promptError } from '$lib/stores/error';

	import { ReadSecret } from '$lib/wailsjs/go/main/App';
	import type { main } from '$lib/wailsjs/go/models';
	import { highlight } from '$lib/utils';
	import { onMount } from 'svelte';

	let secret: main.ReadSecret;

	const readSecret = async (secretName: string) => {
		if ($contexts?.currentNamespace) {
			$loading = true;
			const res = await ReadSecret($contexts.currentNamespace, secretName);
			if (res.err !== '') {
				return promptError(res.err);
			}
			$loading = false;

			secret = res.secret;
		}
	};

	onMount(() => {
		readSecret($page.params['name']);
	});
</script>

{#if secret}
	<div
		class="w-full flex-[0_0_auto]"
		in:fly={{ x: -30, duration: 300 }}
		out:fly={{ x: 30, duration: 300 }}
	>
		<div class="flex items-center gap-2 pl-3">
			<button
				on:click={() => {
					goto('/secrets');
				}}
				class="text-gray-400 hover:text-gray-600"
			>
				<Icon src={ArrowLeftCircle} size="32" />
			</button>

			<h1 class="p-4 text-2xl font-bold text-gray-700">Secret: {secret.metadata.name}</h1>
		</div>

		<div class="relative p-3">
			<button
				on:click={(e) => {
					if (secret)
						navigator.clipboard.writeText(
							Object.entries(secret.data)
								.map(([key, val]) => `${key}=${val}`)
								.join('\n')
						);

					const target = e.currentTarget;
					if (target) {
						target.innerHTML = target.innerHTML.replace('Copy', 'Copied');
						setTimeout(() => {
							target.innerHTML = target.innerHTML.replace('Copied', 'Copy');
						}, 3000);
					}
				}}
				class="mb-2 flex items-center gap-1 rounded-md border border-gray-200 bg-white p-1.5 text-sm text-gray-600 hover:bg-gray-100"
			>
				<Icon src={DocumentDuplicate} size="20" />
				Copy
			</button>

			<pre
				class="w-full overflow-auto rounded-lg border border-gray-200 p-2 text-left text-sm">{@html highlight(
					Object.entries(secret.data)
						.map(([key, val]) => `${key}=${val}`)
						.join('\n'),
					'properties'
				)}</pre>
		</div>
	</div>
{/if}
