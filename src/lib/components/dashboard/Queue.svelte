<script lang="ts">
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import {
		Heading,
		TableBody,
		TableBodyCell,
		Table,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Spinner
	} from 'flowbite-svelte';
	import { dev } from '$app/environment';
	import { fail } from '@sveltejs/kit';
	import Shuffle from './Shuffle.svelte';
	import CreatePlaylist from './CreatePlaylist.svelte';
	import QueueLength from './QueueLength.svelte';

	export let queue: any[] = [];
	export let history: any[] = [];
	export let current: any;

	async function getUser(user: string) {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-user?user=${user}`);
		const data = (await res.json()) as
			| { message: string; success: false }
			| { user: any; success: true };
		if (data.success) return data.user;
		else {
			return fail(res.status, { message: data.message });
		}
	}
	async function getQueue() {
		const res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/queue?user=${encodeURIComponent(
				session?.user.user_metadata.provider_id
			)}`
		);
		const data = (await res.json()) as
			| { message: string; success: false }
			| { queue: any[]; history: any[]; success: true };
		if (data.success) {
			queue =
				(await Promise.all(
					data.queue.map(async (q) => {
						return { ...q, requestedBy: (await getUser(q.requestedBy)).username };
					})
				)) || [];
			history =
				(await Promise.all(
					data.history.map(async (q) => {
						return { ...q, requestedBy: (await getUser(q.requestedBy)).username };
					})
				)) || [];
		} else {
			console.error(data.message);
		}
	}
	async function loopGetQueue() {
		await getQueue();
		setTimeout(loopGetQueue, 5000);
	}

	export let session: Session | null;
	export let supabase: SupabaseClient;

	$: innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<div class="bg-primary-dark-100 rounded-xl mx-[5.63rem] grow max-h-[50dvh] flex-col flex">
	<div class="flex m-4">
		<Heading tag="h2" class="text-white font-inter grow"
			>{#if innerWidth >= 1024}The{/if} Queue</Heading
		>
		<Heading tag="h2" class="text-white font-inter w-fit"
			>{innerWidth >= 1024 ? session?.user.user_metadata.name : ''}</Heading
		>
	</div>
	<div class="grow h-full overflow-auto">
		<Table color="custom" class="text-white font-inter whitespace-nowrap w-full h-full">
			<TableHead>
				<TableHeadCell class="w-1">Pos.</TableHeadCell>
				<TableHeadCell>Track</TableHeadCell>
				<TableHeadCell>Artist</TableHeadCell>
				<TableHeadCell>Duration</TableHeadCell>
				<TableHeadCell>Added By</TableHeadCell>
			</TableHead>
			<TableBody>
				{#await loopGetQueue()}
					<Spinner color="purple" />
				{:then}
					{#each queue as song}
						<TableBodyRow>
							<TableBodyCell>{queue.indexOf(song) + 1}</TableBodyCell>
							<TableBodyCell>{song.title}</TableBodyCell>
							<TableBodyCell>{song.author}</TableBodyCell>
							<TableBodyCell>{song.duration}</TableBodyCell>
							<TableBodyCell>{song.requestedBy}</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/await}
			</TableBody>
		</Table>
	</div>
	<div class="flex pr-2">
		{#if innerWidth >= 1024}
			<QueueLength bind:current bind:history bind:queue text=" songs left out of " />
		{:else}
			<QueueLength bind:current bind:history bind:queue text="/" />
		{/if}
		<Shuffle bind:session bind:queue bind:history />
		<CreatePlaylist bind:queue bind:history bind:current bind:supabase />
	</div>
</div>
