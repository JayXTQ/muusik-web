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
	import { getQueue as getQueueUtils } from '$lib/utils';
	import type { APITrack } from '$lib/types';

	export let queue: APITrack[] = [];
	export let history: APITrack[] = [];
	export let current: APITrack;

	async function getQueue() {
		const ret = await getQueueUtils(session);
		if(ret){
			queue = ret.queue;
			history = ret.history;
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
