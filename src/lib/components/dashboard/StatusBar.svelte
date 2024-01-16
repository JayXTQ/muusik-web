<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { Avatar } from 'flowbite-svelte';
	import { Icon, Pause, Play, Forward } from 'svelte-hero-icons';
	import { dev } from '$app/environment';
	import { fail } from '@sveltejs/kit';
	import CurrentSong from './CurrentSong.svelte';
	import Lyrics from './Lyrics.svelte';
	import PlayPause from './PlayPause.svelte';
	import Skip from './Skip.svelte';

	export let current: any = {};
	export let session: Session | null;
	let currentElapsed: number = 0;
	let currentLyrics: string = 'No lyrics found';
	let playingSong: boolean;

	let currentInfo: { title: string; author: string; duration: string } = {
		title: 'Nothing is playing',
		author: '',
		duration: ''
	};

	async function currentSong(skip?: boolean) {
		if (
			currentElapsed - 1000 < current.durationMS &&
			playingSong &&
			millisToMinutesAndSeconds(currentElapsed) !== current.duration &&
			!skip
		) {
			currentElapsed += 1000;
			return;
		}
		const res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/current-song?user=${encodeURIComponent(
				session?.user.user_metadata.provider_id
			)}`
		);
		const data = (await res.json()) as
			| { message: string; success: false }
			| {
					song: any;
					currentTrackTimeElapsed: number;
					trackLyrics: { lyrics: string };
					success: true;
			  };
		if (data.success) {
			current = data.song;
			currentElapsed = data.currentTrackTimeElapsed;
			currentLyrics = data.trackLyrics.lyrics;
		} else {
			current = {};
			currentElapsed = 0;
			currentLyrics = 'No lyrics found';
			playingSong = false;
		}
		if (!current || !current.title) {
			current = {};
			currentElapsed = 0;
			currentLyrics = 'No lyrics found';
			playingSong = false;
		}
	}
	async function currentSongLoop() {
		await currentSong();
		setTimeout(currentSongLoop, 1000);
	}

	function millisToMinutesAndSeconds(millis: number) {
		const d = new Date(Date.UTC(0, 0, 0, 0, 0, 0, millis)),
			parts = [d.getUTCMinutes(), d.getUTCSeconds()],
			formatted = parts.map((s) => String(s).padStart(2, '0')).join(':');
		if (formatted === 'NaN:NaN') return '00:00';
		return formatted;
	}

	$: innerWidth = 0;
	$: currentInfo = {
		title: current.title || 'Nothing is playing',
		author: current.author || '',
		duration: current.title
			? innerWidth >= 1024
				? `${millisToMinutesAndSeconds(currentElapsed)} out of ${current.duration}`
				: `${millisToMinutesAndSeconds(currentElapsed)}/${current.duration}`
			: ''
	};
</script>

<svelte:window bind:innerWidth />

<div class="bg-primary-dark-300 mx-auto flex rounded-[0.625rem] mt-8 w-full max-w-[48.9rem]">
	{#await currentSongLoop()}
		<CurrentSong current={{ title: '', author: '', duration: '' }} />
	{:then}
		{#if innerWidth >= 700}
			<Avatar rounded src={current.thumbnail} class="h-[5rem] my-auto w-auto ml-[0.94rem]" />
		{/if}
		<CurrentSong bind:current={currentInfo} />
	{/await}
	<Lyrics bind:currentLyrics />
	<PlayPause bind:session bind:playingSong />
	<Skip bind:session bind:current bind:currentElapsed bind:currentLyrics bind:playingSong />
</div>
