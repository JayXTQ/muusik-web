<script lang="ts">
	import type { Session } from "@supabase/supabase-js";
    import { Icon, Forward } from "svelte-hero-icons";
    import { dev } from "$app/environment";
    import { fail } from "@sveltejs/kit";
    export let session: Session | null;
    export let current: any;
	export let currentElapsed: number;
	export let playingSong: boolean; 
	export let currentLyrics: string;

	async function currentSong(skip?: boolean) {
		if (
			currentElapsed - 1000 < current.durationMS &&
			playingSong &&
			millisToMinutesAndSeconds(currentElapsed) !== current.duration &&
			!skip
		) {
			currentElapsed += 1000;
			return;
		}
		const res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/current-song?user=${encodeURIComponent(
				session?.user.user_metadata.provider_id
			)}`
		);
		const data = (await res.json()) as
			| { message: string; success: false }
			| {
					song: any;
					currentTrackTimeElapsed: number;
					trackLyrics: { lyrics: string };
					success: true;
			  };
		if (data.success) {
			current = data.song;
			currentElapsed = data.currentTrackTimeElapsed;
			currentLyrics = data.trackLyrics.lyrics;
		} else {
			current = {};
			currentElapsed = 0;
			currentLyrics = 'No lyrics found';
		}
	}

	async function skip() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/skip`, {
			method: 'POST',
			body: JSON.stringify({ user: session?.user.user_metadata.provider_id })
		});
		const data = (await res.json()) as { message: string; success: false } | { success: true };
		if (data.success) {
			currentSong(true);
			return data.success;
		} else {
			return fail(res.status, { message: data.message });
		}
	}

    function millisToMinutesAndSeconds(millis: number) {
        const d = new Date(Date.UTC(0, 0, 0, 0, 0, 0, millis)),
            parts = [d.getUTCMinutes(), d.getUTCSeconds()],
            formatted = parts.map((s) => String(s).padStart(2, '0')).join(':');
        if (formatted === 'NaN:NaN') return '00:00';
        return formatted;
    }
</script>


<button on:click={() => skip()} class="my-auto mr-[2.48rem]">
    <Icon src={Forward} class="text-white w-auto" solid size="70" />
    <!-- <P class="font-inter text-white text-center absolute w-[70px]">0/1</P> -->
</button>