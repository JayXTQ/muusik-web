<script lang="ts">
    import type { PageData } from './$types';
    import { Heading, P } from 'flowbite-svelte';
    
    export let data: PageData;
</script>

<div class="p-10 space-y-10">
    <Heading tag="h1" class="text-white text-9xl">Your playlists</Heading><br>
    <P class="text-white text-3xl whitespace-pre-line">Click on a playlist to get all it's songs</P>
    <br>
    {#each data.playlists as playlist}
        <a href="/playlist/{playlist.id}" class="text-white text-6xl rounded-lg hover:bg-primary-200 p-5 -m-5">{playlist.name}</a>
    {/each}
</div>