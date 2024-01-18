<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { Icon, ArrowPath } from 'svelte-hero-icons';
	import { dev } from '$app/environment';
	import { fail } from '@sveltejs/kit';
	import { getQueue } from '$lib/utils';
	import type { APITrack } from '$lib/types';

	let shuffleTimer: NodeJS.Timeout;

	export let session: Session | null;
	export let queue: APITrack[];
	export let history: APITrack[];
	
	async function shuffle() {
		clearTimeout(shuffleTimer);
		shuffleTimer = setTimeout(async () => {
			const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/shuffle`, {
				method: 'POST',
				body: JSON.stringify({ user: session?.user.user_metadata.provider_id })
			});
			const data = (await res.json()) as { message: string; success: false } | { success: true };
			if (data.success) {
				const ret = await getQueue(session);
				if (ret) {
					queue = ret.queue;
					history = ret.history;
				}
				return data.success;
			} else {
				return fail(res.status, { message: data.message });
			}
		}, 5000);
	}
</script>

<button on:click={() => shuffle()} class="p-1 m-auto"
	><Icon src={ArrowPath} size="40" solid class="text-white" /></button
>
