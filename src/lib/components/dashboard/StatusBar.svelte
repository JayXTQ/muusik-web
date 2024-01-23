<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { Avatar, Button, DropdownItem } from 'flowbite-svelte';
	import CurrentSong from './CurrentSong.svelte';
	import Lyrics from './Lyrics.svelte';
	import PlayPause from './PlayPause.svelte';
	import Skip from './Skip.svelte';
	import { currentSong as currentSongUtils, millisToMinutesAndSeconds } from '$lib/utils';
	import type { APITrack, Updates } from '$lib/types';
	import VolumeSlider from './VolumeSlider.svelte';
	import { Dropdown } from 'flowbite-svelte';
	import { Bars3, Icon } from 'svelte-hero-icons';

	export let current: APITrack = {};
	export let session: Session | null;
	export let updates: Updates;
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
		if(updates?.track){
			await currentSong(true);
		} else {
			await currentSong();
		}
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

	let dropdown = false;
</script>

<svelte:window bind:innerWidth />

<div class="bg-primary-light-300 dark:bg-primary-dark-300 mx-auto flex rounded-[0.625rem] mt-8 w-full max-w-[48.9rem]">
	{#await currentSongLoop()}
		<CurrentSong current={{ title: '', author: '', duration: '' }} />
	{:then}
		{#if innerWidth >= 700}
			<Avatar rounded src={current.thumbnail} class="h-[5rem] my-auto w-auto ml-[0.94rem]" />
		{/if}
		<CurrentSong bind:current={currentInfo} />
	{/await}
	<button class="my-auto w-auto" on:click={() => dropdown = !dropdown}><Icon src={Bars3} size="70" class="text-white" /></button>
	{#if dropdown}
		<Dropdown placement="top" open={true} class="bg-primary-light-300 dark:bg-primary-dark-300 rounded-lg shadow-lg">
			<VolumeSlider bind:updates bind:session />
			<Lyrics bind:currentLyrics />
		</Dropdown>
	{/if}
	<!-- <Previous bind:session bind:current bind:currentElapsed bind:currentLyrics bind:playingSong /> -->
	<PlayPause bind:session bind:playingSong />
	<Skip bind:session bind:current bind:currentElapsed bind:currentLyrics bind:playingSong />
</div>
