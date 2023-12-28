<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Eye, Icon, ArrowLeftCircle, DocumentDuplicate } from 'svelte-hero-icons';
	import type { Unsubscriber } from 'svelte/motion';

	import { ListSecrets, ReadSecret } from '$lib/wailsjs/go/main/App';
	import { highlight, timestampToHumanReadable } from '$lib/utils';
	import type { main } from '$lib/wailsjs/go/models';

	import contexts from '$lib/stores/contexts';
	import namespaces from '$lib/stores/namespaces';
	import error from '$lib/stores/error';
	import loading from '$lib/stores/loading';

	let secrets: main.ListSecretsResponse['secrets'] = [];
	let selectedSecret: main.ReadSecret | undefined;

	const promptError = (err: string) => {
		$error = err;
		$loading = false;
	};

	const readSecret = async (secretName: string) => {
		if ($contexts?.currentNamespace) {
			$loading = true;
			const res = await ReadSecret($contexts.currentNamespace, secretName);
			if (res.err !== '') {
				return promptError(res.err);
			}
			$loading = false;

			selectedSecret = res.secret;
		}
	};

	let sub: Unsubscriber | undefined;
	onMount(() => {
		sub = namespaces.subscribe(async (val) => {
			if (val.namespaces?.length && $contexts.currentNamespace?.length) {
				$loading = true;
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

{#if !selectedSecret}
	<div
		class="w-full flex-[0_0_auto]"
		in:fly={{ x: 30, duration: 300 }}
		out:fly={{ x: -30, duration: 300 }}
	>
		<h1 class="p-4 text-2xl font-bold text-gray-700">Secrets</h1>
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
										on:click={() => readSecret(secret.name)}
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
										on:click={() => readSecret(secret.name)}><Icon src={Eye} size="24" /></button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{:else}
	<div
		class="w-full flex-[0_0_auto]"
		in:fly={{ x: -30, duration: 300 }}
		out:fly={{ x: 30, duration: 300 }}
	>
		<div class="flex items-center gap-2 pl-3">
			<button
				on:click={() => {
					selectedSecret = undefined;
				}}
				class="text-gray-400 hover:text-gray-600"
			>
				<Icon src={ArrowLeftCircle} size="32" />
			</button>

			<h1 class="p-4 text-2xl font-bold text-gray-700">Secret: {selectedSecret.metadata.name}</h1>
		</div>

		<div class="relative p-3">
			<button
				on:click={(e) => {
					if (selectedSecret)
						navigator.clipboard.writeText(
							Object.entries(selectedSecret.data)
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
					Object.entries(selectedSecret.data)
						.map(([key, val]) => `${key}=${val}`)
						.join('\n'),
					'properties'
				)}</pre>
		</div>
	</div>
{/if}
