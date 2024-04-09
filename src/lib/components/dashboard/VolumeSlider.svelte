<script lang="ts">
	import { Icon, SpeakerWave } from 'svelte-hero-icons';
    import { Dropdown, DropdownItem, Range } from 'flowbite-svelte';
    import type { Updates } from '$lib/types'
    import { dev } from '$app/environment';
	import type { SupabaseClient, Session } from '@supabase/supabase-js';
	import { getAPI } from '$lib/utils';
    export let updates: Updates
    export let supabase: SupabaseClient;
    export let session: Session | null

    async function Volume(type: string){
        const res = await fetch(`${dev ? '//localhost:8000' : await getAPI(supabase, session)}/volume/${type}?user=${session?.user.user_metadata.provider_id}&volume=${volume}`)
        const data = await res.json() as { message: string; success: false } | { success: true } | { volume: string }
        if('volume' in data) volume = Number(data.volume)
    }

    let volume = 100;

	$: innerWidth = 0;
    $: if(updates?.volume) Volume('get')
</script>

<svelte:window bind:innerWidth />
<DropdownItem class="hover:bg-primary-light-400 dark:hover:bg-primary-dark-400">
    <Icon src={SpeakerWave} class="text-white" size="70" solid />
</DropdownItem>
<Dropdown placement="right-end" class="h-44 w-10 bg-primary-light-300 dark:bg-primary-dark-300 rounded-md">
    <Range bind:value={volume} class="-rotate-90 w-40 -ml-[3.75rem] -mb-16" on:change={() => Volume('set')} />
</Dropdown>
