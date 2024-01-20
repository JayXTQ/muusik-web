<script lang="ts">
	import { Icon, SpeakerWave } from 'svelte-hero-icons';
    import { Range } from 'flowbite-svelte';
    import type { Updates } from '$lib/types'
    import { dev } from '$app/environment';
    export let updates: Updates

    async function Volume(type: string){
        const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/volume/${type}`)
        const data = await res.json() as { message: string; success: false } | { success: true } | { volume: string }
        if('volume' in data) volume = Number(data.volume)
    }

    let open = false;
    let volume = 100;

	$: innerWidth = 0;
    $: if(updates?.volume) Volume('get')
</script>

<svelte:window bind:innerWidth />
<div class="my-auto w-auto relative">
    {#if open}
        <div class="bg-primary-light-300 dark:bg-primary-dark-300 absolute h-44 p-5 w-10 -mt-52 ml-2 rounded-md">
            <Range bind:value={volume} class="-rotate-90 w-40 -ml-20 -mb-12" on:change={() => Volume('set')} />
        </div>
    {/if}
    {#if innerWidth >= 580}
        <button on:click={() => open = !open}>
            <Icon src={SpeakerWave} class="text-white" size="70" solid />
        </button>
    {/if}
</div>
