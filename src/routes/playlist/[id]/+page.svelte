<script lang="ts">
	import { Heading, P, Secondary, Button } from 'flowbite-svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>
<div class="p-10 space-y-10">
    <Button href="/" class="text-5xl" color="alternative">Back</Button>
    <Heading tag="h1" class="text-white text-9xl">{data.playlist.name}</Heading><br>
    <Secondary class="text-3xl text-white whitespace-pre-line">Click on a song to get to it's source.

This playlist can be used inside of muusik, just copy the URL and paste it into the search box</Secondary>
    {#each data.playlist.songs as song}
        <a class="flex gap-4 p-5 -m-5 hover:bg-primary-200 rounded-lg" href={song.url}>
            <img src={song.metadata.image} alt="Song Art" class="h-72 w-auto my-auto" />
            <div class="my-auto mt-1 space-y-4">
                <P class="text-white text-8xl">{song.metadata.name}</P>
                <P class="text-white text-7xl">{song.metadata.artist}</P>
                <P class="text-white text-6xl">{song.metadata.duration}</P>
            </div>
        </a>
    {/each}
</div>