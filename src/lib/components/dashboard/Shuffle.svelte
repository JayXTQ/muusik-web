<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { Icon, ArrowPath } from 'svelte-hero-icons';
	import { dev } from '$app/environment';
	import { fail } from '@sveltejs/kit';
	let shuffleTimer: NodeJS.Timeout;

	export let session: Session | null;
	export let queue: any[];
	export let history: any[];

	async function getUser(user: string) {
		const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-user?user=${user}`);
		const data = (await res.json()) as
			| { message: string; success: false }
			| { user: any; success: true };
		if (data.success) return data.user;
		else {
			return fail(res.status, { message: data.message });
		}
	}
	async function getQueue() {
		const res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/queue?user=${encodeURIComponent(
				session?.user.user_metadata.provider_id
			)}`
		);
		const data = (await res.json()) as
			| { message: string; success: false }
			| { queue: any[]; history: any[]; success: true };
		if (data.success) {
			queue =
				(await Promise.all(
					data.queue.map(async (q) => {
						return { ...q, requestedBy: (await getUser(q.requestedBy)).username };
					})
				)) || [];
			history = data.history || [];
		} else {
			console.error(data.message);
		}
	}
	async function shuffle() {
		clearTimeout(shuffleTimer);
		shuffleTimer = setTimeout(async () => {
			const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/shuffle`, {
				method: 'POST',
				body: JSON.stringify({ user: session?.user.user_metadata.provider_id })
			});
			const data = (await res.json()) as { message: string; success: false } | { success: true };
			if (data.success) {
				getQueue();
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
