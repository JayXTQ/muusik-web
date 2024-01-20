<script lang="ts">
	import { Heading, P, Secondary, Button } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let description = data.playlist.songs[1] ? `A muusik.app playlist, containing music like ${data.playlist.songs[0].metadata.name} by ${data.playlist.songs[0].metadata.artist} and ${data.playlist.songs[1].metadata.name} by ${data.playlist.songs[1].metadata.artist}` : `A muusik.app playlist, containing ${data.playlist.songs[0].metadata.name} by ${data.playlist.songs[0].metadata.artist}`;
</script>

<svelte:head>
	<title>{data.playlist.name} - muusik.app playlists</title>
	<meta content="{data.playlist.name} | muusik.app playlists" property="og:title" />
	<meta
		content="{description}"
		property="og:description"
	/>
	<meta content={data.playlist.songs[0].metadata.image} property="og:image" />
	<meta content="https://muusik.app/playlist/{data.id}" property="og:url" />
	<meta content="#562353" data-react-helmet="true" name="theme-color" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<meta
		name="description"
		content="View all the songs inside of the {data.playlist
			.name} playlist, created via the dashboard!"
	/>
</svelte:head>

<div class="p-10 space-y-10 pt-20">
	<Button href="/" class="text-5xl" color="alternative">Back</Button>
	<Heading tag="h1" class="dark:text-white text-9xl">{data.playlist.name}</Heading><br />
	<Secondary class="text-3xl dark:text-white whitespace-pre-line"
		>Click on a song to get to it's source. This playlist can be used inside of muusik, just copy
		the URL and paste it into the search box</Secondary
	>
	{#each data.playlist.songs as song}
		<a class="flex gap-4 p-5 -m-5 hover:bg-primary-light-300 dark:hover:bg-primary-dark-300 rounded-lg" href={song.url}>
			<img src={song.metadata.image} alt="Song Art" class="h-24 lg:h-72 w-auto my-auto" />
			<div class="my-auto mt-1 space-y-4">
				<P class="dark:text-white text-3xl lg:text-8xl">{song.metadata.name}</P>
				<P class="dark:text-white text-2xl lg:text-7xl">{song.metadata.artist}</P>
				<P class="dark:text-white text-xl lg:text-6xl">{song.metadata.duration}</P>
			</div>
		</a>
    {/each}
</div>
