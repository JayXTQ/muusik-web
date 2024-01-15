<script lang="ts">
    import type { PageData } from './$types';
    import { Heading, P } from 'flowbite-svelte';
    
    export let data: PageData;
</script>

<svelte:head>
	<title>Playlists - muusik.app</title>
	<meta content="Playlists | muusik.app" property="og:title" />
	<meta
		content="View all your muusik playlists, created via the dashboard!"
		property="og:description"
	/>
	<meta content="https://muusik.app/playlist" property="og:url" />
	<meta content="#3A015C" data-react-helmet="true" name="theme-color" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<meta name="description" content="View all your muusik playlists, created via the dashboard!" />
</svelte:head>

<div class="p-10 space-y-10">
    <Heading tag="h1" class="text-white text-9xl">Your playlists</Heading><br>
    <P class="text-white text-3xl whitespace-pre-line">Click on a playlist to get all it's songs</P>
    <br>
    {#each data.playlists as playlist}
        <a href="/playlist/{playlist.id}" class="text-white text-6xl rounded-lg hover:bg-primary-200 p-5 -m-5">{playlist.name}</a>
    {/each}
</div>