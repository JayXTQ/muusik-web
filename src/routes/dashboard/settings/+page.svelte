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
</script>

<div class="flex">
    <div class="mx-auto p-10 space-y-4">
        <Button href="/dashboard" color="purple">Back</Button>
        <Heading tag="h1" class="dark:text-white">Settings</Heading>
        <form method="POST" class="space-y-4">
                {#if data.owner}
                    <Heading tag="h2" class="text-white">Server Settings</Heading>
                    <Label class="whitespace-pre-line text-white mb-2">API 
<strong>Only change this if you know what you are doing!</strong>
                        <Input type="text" value={data.guildsettings.api} name="guildapi" />
                    </Label>
                {/if}
            <Button type="submit" color="purple">Save</Button>
        </form>
        <Button color="purple" on:click={() => supabase.auth.signOut()}>Logout</Button>
    </div>
</div>