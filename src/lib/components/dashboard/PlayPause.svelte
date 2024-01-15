<script lang="ts">
    import { dev } from "$app/environment";
	import type { Session } from "@supabase/supabase-js";
    import { Icon, Play, Pause } from "svelte-hero-icons";
    import { fail } from "@sveltejs/kit";

    export let session: Session | null;
    export let playingSong: boolean = false;

	async function playPause() {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/pause`, {
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
	async function checkPlaying() {
		const res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/check-playing?user=${encodeURIComponent(
				session?.user.user_metadata.provider_id
			)}`
		);
		const data = (await res.json()) as
			| { message: string; success: false }
			| { playing: boolean; success: true };
		if (data.success) {
			playingSong = data.playing;
		} else {
			playingSong = false;
			return fail(res.status, { message: data.message });
		}
	}
</script>

<button on:click={() => playPause()} class="my-auto">
    {#await checkPlaying() then}
        <Icon src={playingSong || false ? Pause : Play} class="text-white" size="70" solid />
    {/await}
</button>