<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { Avatar } from 'flowbite-svelte';
	import CurrentSong from './CurrentSong.svelte';
	import Lyrics from './Lyrics.svelte';
	import PlayPause from './PlayPause.svelte';
	import Skip from './Skip.svelte';
	import { currentSong as currentSongUtils, millisToMinutesAndSeconds } from '$lib/utils';
	import type { APITrack } from '$lib/types';

	export let current: APITrack = {};
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
		const ret = await currentSongUtils(session, current, currentElapsed, playingSong, skip);
		current = ret.current;
		currentElapsed = ret.currentElapsed;
		playingSong = ret.playingSong;
		if (ret.currentLyrics) currentLyrics = ret.currentLyrics;
	}
	async function currentSongLoop() {
		await currentSong();
		setTimeout(currentSongLoop, 1000);
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
