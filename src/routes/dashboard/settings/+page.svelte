<script lang="ts">
    import { Heading, Label, Input, Button } from 'flowbite-svelte';
    import type { PageData } from './$types';
    import { dev } from '$app/environment';
    
    export let data: PageData;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    if (!session) {
        supabase.auth.signInWithOAuth({ provider: 'discord' });
    }

    // let owner = false;
    // let guildId = '';
    // let guildsettings: {
    //     api: string;
    // } = {
    //     api: 'https://api.muusik.app'
    // }

    // async function getOwner(){
    //     const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-owner?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`);
    //     const data = (await res.json()) as
    //         | { message: string; success: false }
    //         | { owner: string; guild: string; success: true };
    //     if (data.success) {
    //         owner = data.owner === session?.user.user_metadata.provider_id;
    //         guildId = data.guild;
    //     }
    // }

    // async function guildSettings(){
    //     const { data, error } = await supabase.from('guilds').select('settings').eq('id', guildId).single() as { data: { settings: { api: string } }, error: any };
    //     if(error){
    //         guildsettings = {
    //             api: 'https://api.muusik.app'
    //         }
    //     } else {
    //         guildsettings = {
    //             api: data.settings.api || 'https://api.muusik.app'
    //         };
    //     }
    // }
</script>

<div class="flex">
    <div class="mx-auto p-10 space-y-4">
        <Button href="/dashboard" color="purple">Back</Button>
        <Heading tag="h1" class="dark:text-white">Settings</Heading>
        <!-- <form method="POST" class="space-y-4">
            {#await getOwner() then}
                {#if owner}
                    {#await guildSettings() then}
                        <Heading tag="h2" class="text-white">Server Settings</Heading>
                        <Label class="whitespace-pre-line text-white mb-2">API 
<strong>Only change this if you know what you are doing!</strong>
                            <Input type="text" value={guildsettings.api} name="guildapi" />
                        </Label>
                    {/await}
                {/if}
            {/await}
            <Button type="submit" color="purple">Save</Button>
        </form> -->
        <Button color="purple" on:click={() => supabase.auth.signOut()}>Logout</Button>
    </div>
</div>