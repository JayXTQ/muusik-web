<script lang="ts">
	import { Input, Modal, Spinner, Button, A, P } from 'flowbite-svelte';
	import { dev } from '$app/environment';
	import type { Session } from '@supabase/supabase-js';
	import { fail } from '@sveltejs/kit';
	import type { Tracks, Songs, APITrack } from '$lib/types';
	import { checkExists } from '$lib/utils';

	export let session: Session | null;
	export let current: APITrack;

	let searchQuery: string = '';
	let songs: Tracks = [];
	let timer: NodeJS.Timeout;
	let chosenUrl: string;
	let selectModal: boolean = false;
	let playing: { res: Response; data: { message?: string; success: boolean } } | undefined;

	async function playPlaylist() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/playlist`, {
			method: 'POST',
			body: JSON.stringify({ user: session?.user.user_metadata.provider_id, url: searchQuery })
		});
		const data = (await res.json()) as { message: string; success: false } | { success: true };
		if (checkExists(current)) location.reload();
		if (data.success) return data.success;
		else {
			return fail(res.status, { message: data.message });
		}
	}

	function checkPlaylist(input: string) {
		if (
			input.startsWith('https://open.spotify.com/playlist/') ||
			input.startsWith(`http${dev ? '://localhost:5173' : 's://muusik.app'}/playlist/`)
		)
			return true;
		else return false;
	}
	function searchSong() {
		if (checkPlaylist(searchQuery)) return;
		clearTimeout(timer);
		timer = setTimeout(async () => {
			const res = await fetch(
				`//${dev ? 'localhost:8000' : 'api.muusik.app'}/find-song?query=${encodeURIComponent(
					searchQuery
				)}`
			);
			const data: Songs = await res.json();
			if (res.status === 200) {
				songs = data.tracks.track.slice(0, 5);
			}
		}, 500);
	}
	async function playLinks() {
		let res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-playlinks?url=${encodeURIComponent(
				chosenUrl
			)}`
		);
		const playLinkData = (await res.json()) as
			| { message: string; success: false }
			| { links: string[]; success: true };
		if (!playLinkData.success) throw fail(res.status, { message: playLinkData.message });
		const links = playLinkData.links;
		res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/song-info?url=${encodeURIComponent(
				chosenUrl
			)}`
		);
		const songdata = (await res.json()) as
			| { message: string; success: false }
			| { albumCover: string; songName: string; success: true };
		if (!songdata.success) throw fail(res.status, { message: songdata.message });
		return {
			links: Array.isArray(links) ? links : [],
			albumCover: songdata.albumCover,
			chosenSongName: songdata.songName
		};
	}
	async function play(url: string) {
		selectModal = false;
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/play`, {
			method: 'POST',
			body: JSON.stringify({ url, user: session?.user.user_metadata.provider_id })
		});
		const data = (await res.json()) as { message?: string; success: boolean };
		if (checkExists(current)) location.reload();
		return { res, data };
	}

	$: if (!selectModal) {
		playing = undefined;
	}

	$: if (searchQuery === '') songs = [];
</script>

<Input
	size="lg"
	type="text"
	name="query"
	placeholder="Search"
	class="bg-primary-light-250 dark:bg-primary-dark-250 text-white mx-auto rounded-xl mt-8 font-inter border-primary-light-350 dark:border-primary-dark-350 border-4 w-full xl:max-w-[48.9rem]"
	on:input={() => searchSong()}
	bind:value={searchQuery}
/>
{#if songs.length !== 0 || checkPlaylist(searchQuery)}
	<div
		class="flex mx-auto bg-primary-light-250 dark:bg-primary-dark-250 max-h-40 lg:max-h-[24.5625rem] rounded-[1.25rem] border-primary-light-350 dark:border-primary-dark-350 border-[5px] w-full xl:max-w-[48.9rem] overflow-y-auto overflow-x-auto mt-5"
	>
		<div>
			{#if !checkPlaylist(searchQuery)}
				{#each songs as song}
					<button
						class="flex my-[1.06rem] w-full overflow-hidden"
						on:click={() => {
							chosenUrl = song.url;
							selectModal = true;
						}}
					>
						<div class="my-auto lg:h-[7.5rem] h-16 ml-4 grow">
							<P class="font-inter text-white lg:text-5xl text-md !truncate">{song.name}</P>
							<P class="font-inter text-white lg:text-4xl text-sm !truncate">{song.artist}</P>
						</div>
					</button>
				{/each}
			{:else}
				<button
					class="flex my-[1.06rem] w-full overflow-hidden"
					on:click={() => {
						playPlaylist();
					}}
				>
					<div class="my-auto lg:h-[7.5rem] !h-fit ml-4 grow">
						<P class="font-inter text-white lg:text-5xl text-md !truncate"
							>Click to play this playlist</P
						>
					</div>
				</button>
			{/if}
		</div>
	</div>
{/if}
{#if selectModal}
	<Modal title="Choose song location" bind:open={selectModal}>
		{#await playLinks()}
			<Spinner color="purple" size="md" class="flex mx-auto h-40 w-auto overflow-hidden" />
		{:then links}
			{#if playing && playing?.res?.status !== 200}
				<P class="text-red-600">{playing.data.message}</P>
			{/if}
			<div class="flex flex-col gap-2">
				<img
					src={links.albumCover}
					class="w-32 h-auto mx-auto"
					alt="Album cover for selected song"
				/>
				<P class="text-xl mx-auto my-4">{links.chosenSongName}</P>
				{#each links.links as link}
					{#if link.includes('spotify')}
						<Button
							color="green"
							class="font-inter w-full"
							size="lg"
							on:click={async () => (playing = await play(link))}>Spotify</Button
						><br />
						<A
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							class="font-inter w-fit text-blue-500 text-center mx-auto">Open in Spotify</A
						><br />
					{:else if link.includes('youtube')}
						<Button
							color="red"
							class="font-inter w-full"
							size="lg"
							on:click={async () => (playing = await play(link))}>YouTube</Button
						><br />
						<A
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							class="font-inter w-fit text-blue-500 text-center mx-auto">Open in YouTube</A
						><br />
					{:else if link.includes('apple')}
						<Button
							color="alternative"
							class="font-inter w-full text-black"
							size="lg"
							on:click={async () => (playing = await play(link))}>Apple Music</Button
						><br />
						<A
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							class="font-inter w-fit text-blue-500 text-center mx-auto">Open in Apple Music</A
						><br />
					{/if}
				{/each}
			</div>
		{:catch}
			<P>Something went wrong, try closing and opening again</P>
		{/await}
	</Modal>
{/if}
