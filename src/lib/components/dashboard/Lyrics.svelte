<script lang="ts">
	import { Icon, ChatBubbleBottomCenterText } from 'svelte-hero-icons';
	import { DropdownItem, Modal } from 'flowbite-svelte';

	$: innerWidth = 0;

	let lyricsModal = false;
	export let currentLyrics: string;
</script>

<svelte:window bind:innerWidth />

<DropdownItem on:click={() => (lyricsModal = true)} class="hover:bg-primary-light-400 dark:hover:bg-primary-dark-400">
	<Icon src={ChatBubbleBottomCenterText} class="text-white" size="70" solid />
</DropdownItem>
<Modal title="Lyrics" class="max-h-[50dvh] overflow-auto" bind:open={lyricsModal}>
	<pre class="font-inter">{currentLyrics || 'No lyrics found'}</pre>
</Modal>
