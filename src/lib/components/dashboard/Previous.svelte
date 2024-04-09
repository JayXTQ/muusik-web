<script lang="ts">
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { Icon, Forward, Backward } from 'svelte-hero-icons';
	import { dev } from '$app/environment';
	import { fail } from '@sveltejs/kit';
	import { currentSong, getAPI } from '$lib/utils';
	import type { APITrack } from '$lib/types';

	export let session: Session | null;
	export let supabase: SupabaseClient
	export let current: APITrack;
	export let currentElapsed: number;
	export let playingSong: boolean;
	export let currentLyrics: string;

	async function previous() {
		const res = await fetch(`${dev ? '//localhost:8000' : await getAPI(supabase, session)}/previous`, {
			method: 'POST',
			body: JSON.stringify({ user: session?.user.user_metadata.provider_id })
		});
		const data = (await res.json()) as { message: string; success: false } | { success: true };
		if (data.success) {
			const ret = await currentSong(session, current, currentElapsed, playingSong, supabase, true);
			current = ret.current;
			currentElapsed = ret.currentElapsed;
			playingSong = ret.playingSong;
			if(ret.currentLyrics) currentLyrics = ret.currentLyrics;
			return data.success;
		} else {
			return fail(res.status, { message: data.message });
		}
	}
</script>

<button on:click={() => previous()} class="my-auto ml-5">
	<Icon src={Backward} class="text-white w-auto" solid size="70" />
	<!-- <P class="font-inter text-white text-center absolute w-[70px]">0/1</P> -->
</button>
