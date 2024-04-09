<script lang="ts">
	import { dev } from '$app/environment';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { Icon, Play, Pause } from 'svelte-hero-icons';
	import { fail } from '@sveltejs/kit';
	import { checkPlaying as checkPlayingUtils, getAPI } from '$lib/utils';

	export let supabase: SupabaseClient;
	export let session: Session | null;
	export let playingSong: boolean = false;

	async function playPause() {
		const res = await fetch(`${dev ? '//localhost:8000' : await getAPI(supabase, session)}/pause`, {
			method: 'POST',
			body: JSON.stringify({ user: session?.user.user_metadata.provider_id })
		});
		const data = (await res.json()) as
			| { message: string; success: false }
			| { playing: boolean; success: true };
		if (data.success) {
			playingSong = !data.playing;
		} else {
			return fail(res.status, { message: data.message });
		}
	}
	async function checkPlaying(){
		playingSong = await checkPlayingUtils(session, supabase);
	}
</script>

<button on:click={() => playPause()} class="my-auto">
	{#await checkPlaying() then}
		<Icon src={playingSong || false ? Pause : Play} class="text-white" size="70" solid />
	{/await}
</button>
