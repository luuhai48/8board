<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Eye, Icon } from 'svelte-hero-icons';
	import type { Unsubscriber } from 'svelte/motion';

	import { ListSecrets } from '$lib/wailsjs/go/main/App';
	import { timestampToHumanReadable } from '$lib/utils';
	import type { main } from '$lib/wailsjs/go/models';

	import contexts from '$lib/stores/contexts';
	import namespaces from '$lib/stores/namespaces';
	import loading from '$lib/stores/loading';
	import { promptError } from '$lib/stores/error';
	import { goto } from '$app/navigation';

	let secrets: main.ListSecretsResponse['secrets'] = [];

	let sub: Unsubscriber | undefined;
	onMount(() => {
		sub = namespaces.subscribe(async (val) => {
			if (val.namespaces?.length && $contexts.currentNamespace?.length) {
				$loading = true;
				secrets = [];

				const res = await ListSecrets($contexts.currentNamespace);
				if (res.err !== '') {
					return promptError(res.err);
				}
				secrets = res.secrets;
				$loading = false;
			}
		});
	});

	onDestroy(() => {
		if (sub) {
			sub();
			sub = undefined;
		}
	});
</script>

<div
	class="w-full flex-[0_0_auto]"
	in:fly={{ x: 30, duration: 300 }}
	out:fly={{ x: -30, duration: 300 }}
>
	<h1 class="p-4 text-2xl font-bold text-gray-700">Secrets ({secrets.length})</h1>
	<div class="w-full p-3 pb-8">
		<div class="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
			<table class="w-full text-left text-sm text-gray-500 rtl:text-right">
				<thead class="bg-gray-50 text-xs uppercase text-gray-700">
					<tr>
						<th scope="col" class="p-4"></th>
						<th scope="col" class="px-6 py-3">Name</th>
						<th scope="col" class="px-6 py-3">Type</th>
						<th scope="col" class="px-6 py-3">Data</th>
						<th scope="col" class="px-6 py-3">Age</th>
						<th scope="col" class="px-6 py-3">Last Update</th>
						<th scope="col" class="w-10 py-3"></th>
					</tr>
				</thead>
				<tbody>
					{#each secrets as secret, idx}
						<tr class="border-b bg-white hover:bg-gray-50">
							<td class="w-4 p-4">
								{idx + 1}
							</td>
							<th scope="row" class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
								<button
									class="w-full text-left hover:underline"
									on:click={() => {
										goto('/secrets/' + secret.name);
									}}
								>
									{secret.name}
								</button>
							</th>
							<td class="px-6 py-4">{secret.type}</td>
							<td class="px-6 py-4">{secret.data}</td>
							<td class="px-6 py-4">{timestampToHumanReadable(secret.createdAt)}</td>
							<td class="px-6 py-4">{timestampToHumanReadable(secret.lastUpdate)}</td>
							<td class="flex w-10 items-center justify-center py-4">
								<button
									class="text-gray-400 hover:text-gray-600"
									on:click={() => {
										goto('/secrets/' + secret.name);
									}}><Icon src={Eye} size="24" /></button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
