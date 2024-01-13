<script lang="ts">
	import { browser, dev } from '$app/environment';
	import type { Songs, Tracks } from '$lib/types.js';
	import { fail } from '@sveltejs/kit';

	export let data
	let { supabase, session } = data
	$: ({ supabase, session } = data)

	if(!session) {
		supabase.auth.signInWithOAuth({ provider: 'discord' })
	}

	import {
		P,
		Heading,
		Button,
		A,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Input,
		Avatar,

		Modal,

		Spinner


	} from 'flowbite-svelte';
	import { Icon, Cog6Tooth, Pause, Forward, Play } from 'svelte-hero-icons';

	let songs: Tracks = [];
	let timer: NodeJS.Timeout;
	let searchQuery: string = '';
	let chosenUrl: string;
	let links: string[]
	let queue: any[] = []
	let history: any[] = []
	let current: any = {}
	let currentElapsed: number = 0;
	let playingSong: boolean = false;

	function searchSong() {
		if(checkPlaylist(searchQuery)) return;
		clearTimeout(timer);
		timer = setTimeout(async () => {
			const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/find-song?query=${encodeURIComponent(searchQuery)}`);
			const data: Songs = await res.json();
			if (res.status === 200) {
				songs = data.tracks.track.slice(0, 5);
			}
		}, 500);
	}
	function checkCurrent() {
		if(JSON.stringify(current) === JSON.stringify({})) return false
		else return true
	}
	async function playLinks()  {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-playlinks?url=${encodeURIComponent(chosenUrl)}`);
		links = (await res.json()).links as unknown as string[];
		return links
	}
	async function play(url: string) {
		selectModal = false;
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/play`, { method: 'POST', body: JSON.stringify({ url, user: session?.user.user_metadata.provider_id }) });
		const data = await res.json() as { message?: string, success: boolean };
		if(checkCurrent()) location.reload()
		return { res, data }
	}
	async function getQueue() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/queue?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`);
		const data = await res.json() as { message: string, success: false } | { queue: any[], history: any[], success: true };
		if (data.success) {
			queue = await Promise.all(data.queue.map(async (q) => { return { ...q, requestedBy: (await getUser(q.requestedBy)).username}})) || [];
			history = data.history || [];
		}
		else {
			console.error(data.message);
		}
	}
	async function loopGetQueue() {
		await getQueue();
		setTimeout(loopGetQueue, 5000);
	}
	async function findUser() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/find-user?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`);
		const data = await res.json() as { message: string, success: false } | { user: any, success: true };
		if (data.success)
			return data.success;
		else {
			return fail(res.status, { message: data.message })
		}
	}
	async function getUser(user: string) {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-user?user=${user}`);
		const data = await res.json() as { message: string, success: false } | { user: any, success: true };
		if (data.success)
			return data.user;
		else {
			return fail(res.status, { message: data.message })
		}
	}
	async function currentSong() {
		if(currentElapsed-1000 < current.durationMS && playingSong && millisToMinutesAndSeconds(currentElapsed) !== current.duration) {
			currentElapsed += 1000;
			return;
		}
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/current-song?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`);
		const data = await res.json() as { message: string, success: false } | { song: any, currentTrackTimeElapsed: number, success: true };
		if (data.success) {
			current = data.song;
			currentElapsed = data.currentTrackTimeElapsed;
		}
		else {
			current = {};
			currentElapsed = 0;
		}
	}
	async function currentSongLoop() {
		await currentSong();
		setTimeout(currentSongLoop, 1000);
	}
	async function skip() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/skip`, {
			method: 'POST',
			body: JSON.stringify({ user: session?.user.user_metadata.provider_id })
		});
		const data = await res.json() as { message: string, success: false } | { success: true };
		if (data.success)
			return data.success;
		else {
			return fail(res.status, { message: data.message })
		}
	}
	async function playPause() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/pause`, {
			method: 'POST',
			body: JSON.stringify({ user: session?.user.user_metadata.provider_id })
		});
		const data = await res.json() as { message: string, success: false } | { playing: boolean, success: true };
		if (data.success) {
			playingSong = !data.playing;
		} else {
			return fail(res.status, { message: data.message })
		}
	}
	async function checkPlaying() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/check-playing?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`);
		const data = await res.json() as { message: string, success: false } | { playing: boolean, success: true };
		if (data.success) {
			playingSong = data.playing;
		} else {
			playingSong = false;
			return fail(res.status, { message: data.message })
		}
	}
	async function playPlaylist() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/playlist`, {
			method: 'POST',
			body: JSON.stringify({ user: session?.user.user_metadata.provider_id, url: searchQuery })
		});
		const data = await res.json() as { message: string, success: false } | { success: true };
		if(checkCurrent()) location.reload()
		if (data.success)
			return data.success;
		else {
			return fail(res.status, { message: data.message })
		}
	
	}

	function checkPlaylist(input: string) {
		if(input.startsWith('https://open.spotify.com/playlist/') || (input.startsWith("https://music.apple.com") && input.includes("playlist"))) return true
		else return false
	}

	function millisToMinutesAndSeconds(millis: number) {
		const d = new Date(Date.UTC(0,0,0,0,0,0,millis)),
		parts = [
			d.getUTCMinutes(),
			d.getUTCSeconds()
		],
		formatted = parts.map(s => String(s).padStart(2,'0')).join(':');
		return formatted
	}

	$: if (searchQuery === '') {
		songs = [];
	}
	
	let playing: { res: Response, data: { message?: string, success: boolean } } | undefined;

	$: if (!selectModal) {
		playing = undefined;
	}

	let selectModal = false;
</script>

<svelte:head>
	<title>Dashboard - muusik.app</title>
	<meta content="Dashboard | muusik.app" property="og:title" />
	<meta
		content="The dashboard for Muusik, an open-source Discord music bot"
		property="og:description"
	/>
	<meta content="https://muusik.app/dashboard" property="og:url" />
	<meta content="#3A015C" data-react-helmet="true" name="theme-color" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<meta name="description" content="The dashboard for Muusik, an open-source Discord music bot" />
</svelte:head>

<!-- <pre class="text-white">{JSON.stringify(songs, null, 4)}</pre> -->
{#await findUser()}
	<Spinner color="purple" size="lg" />
{:then}
	<button
		><Icon
			src={Cog6Tooth}
			class="float-right m-5 text-white absolute right-0 top-0"
			solid
			size="68"
		/></button
	>
	<div class="flex flex-col justify-center h-screen mr-56 w-full -mt-6">
		<div class="bg-primary-100 rounded-xl mx-[5.63rem] grow max-h-96 flex-col flex">
			<div class="flex m-4">
				<Heading tag="h2" class="text-white font-inter grow">The Queue</Heading>
				<Heading tag="h2" class="text-white font-inter w-fit">{session?.user.user_metadata.name}</Heading>
			</div>
			<div class="grow h-80 overflow-auto">
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
			<Heading tag="h2" class="text-white font-inter h-fit m-4 w-fit">{queue.length} songs left out of {(history.length + queue.length) !== 0 ? (history.length + queue.length)+1 : (checkCurrent() ? 1 : 0)}</Heading
			>
		</div>

		<Input
			size="lg"
			type="text"
			name="query"
			placeholder="Search"
			class="bg-primary-100 text-white mx-auto rounded-xl mt-8 font-inter border-primary-200 border-4 w-full xl:max-w-[48.9rem]"
			on:input={() => searchSong()}
			bind:value={searchQuery}
		/>
		{#if songs.length !== 0 || checkPlaylist(searchQuery)}
			<div
			class="flex mx-auto bg-primary-100 max-h-5 lg:max-h-[24.5625rem] rounded-[1.25rem] border-primary-200 border-[5px] w-full xl:max-w-[48.9rem] overflow-y-auto overflow-x-clip mt-5"
		>
			<div>
				{#if !checkPlaylist(searchQuery)}
					{#each songs as song}
						<button class="flex my-[1.06rem] w-full overflow-hidden" on:click={() => {
							chosenUrl = song.url;
							selectModal = true;
						}}>
							<div class="my-auto lg:h-[7.5rem] h-16 ml-4 grow">
								<P class="font-inter text-white lg:text-5xl text-md !truncate">{song.name}</P>
								<P class="font-inter text-white lg:text-4xl text-sm !truncate">{song.artist}</P>
							</div>
						</button>
					{/each}
				{:else}
					<button class="flex my-[1.06rem] w-full overflow-hidden" on:click={() => {
						playPlaylist();
					}}>
						<div class="my-auto lg:h-[7.5rem] !h-fit ml-4 grow">
							<P class="font-inter text-white lg:text-5xl text-md !truncate">Click to play this playlist</P>
						</div>
					</button>
				{/if}
			</div>
		</div>
		{/if}
		{#if selectModal}
			<Modal title="Choose song location" bind:open={selectModal}>
				{#await playLinks()}
					<Spinner color="purple" size="lg" />
				{:then links}
					{#if playing && playing?.res?.status !== 200}
						<P class="text-red-600">{playing.data.message}</P>
					{/if}
					{#each links as link}
						{#if link.includes("spotify")}
							<Button color="green" class="font-inter w-max" size="lg" on:click={async () => playing = await play(link)}>Spotify</Button>{#if links.length !== 1}<br />{/if}
						{:else if link.includes("youtube")}
							<Button color="red" class="font-inter w-max" size="lg" on:click={async () => playing = await play(link)}>YouTube</Button>{#if links.length !== 1}<br />{/if}
						{:else if link.includes("apple")}
							<Button color="alternative" class="font-inter w-max text-black" size="lg" on:click={async () => playing = await play(link)}>Apple Music</Button>{#if links.length !== 1}<br />{/if}
						{/if}
					{/each}
				{:catch}
					<P>Something went wrong, try closing and opening again</P>
				{/await}
			</Modal>
		{/if}

		<div class="bg-primary-300 mx-auto flex rounded-[0.625rem] mt-8 w-full xl:max-w-[48.9rem]">
			{#await currentSongLoop() then}
			<Avatar rounded src={current.thumbnail} class="h-[5rem] my-auto w-auto ml-[0.94rem]" />
				<div class="my-auto h-[7.5rem] ml-4 grow flex">
					<div class="my-auto">
							<P class="font-inter text-white text-3xl">{current.title || "Nothing is playing"}</P>
							<P class="font-inter text-white text-2xl">{current.author || ""}</P>
							<P class="font-inter text-white text-xl">{current.title ? `${millisToMinutesAndSeconds(currentElapsed)} out of ${current.duration}` : ''}</P>
					</div>
				</div>
			{/await}
			<button on:click={() => playPause()} class="my-auto w-auto">
				{#await checkPlaying() then}
					<Icon src={playingSong || false ? Pause : Play} class="text-white" size="70" solid />
				{/await}
			</button>
			<button on:click={() => skip()} class="my-auto mr-[2.48rem]">
				<Icon src={Forward} class="text-white w-auto" solid size="70" />
				<!-- <P class="font-inter text-white text-center absolute w-[70px]">0/1</P> -->
			</button>
		</div>
	</div>
{/await}