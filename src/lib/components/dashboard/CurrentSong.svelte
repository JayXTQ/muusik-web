<script lang="ts">
	export let current: {
		title: string;
		author: string;
		duration: string;
	};
	import { P } from 'flowbite-svelte';

	$: innerWidth = 0;

	let xs = 450;
	let s = 650;
</script>

<svelte:window bind:innerWidth />

<div class="my-auto h-[7.5rem] ml-4 grow flex sm:w-full">
	<div class="my-auto">
		<p class="font-inter text-white text-3xl whitespace-nowrap">
			{innerWidth >= xs
				? current.title.length <= 20 && innerWidth >= s
					? current.title
					: current.title.substring(0, 11) + '...'
				: current.title.substring(0, 7) + '...'}
		</p>
		<P class="font-inter text-white text-2xl whitespace-nowrap"
			>{innerWidth >= xs || !current.author
				? (current.author.length <= 20 && innerWidth >= s) || !current.author
					? current.author
					: current.author.substring(0, 13) + '...'
				: current.author.substring(0, 10) + '...'}</P
		>
		<P class="font-inter text-white text-xl">{current.duration}</P>
	</div>
</div>
