<script lang="ts">
	import { dev } from '$app/environment';
	import { fail } from '@sveltejs/kit';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	if (!session) {
		supabase.auth.signInWithOAuth({ provider: 'discord' });
	}

	import { Loading } from '$lib/components';
	import { Queue, SearchSong, StatusBar } from '$lib/components/dashboard';
	import { Icon, Cog6Tooth } from 'svelte-hero-icons';

	let current: any = {};

	async function findUser() {
		const res = await fetch(
			`//${dev ? 'localhost:8000' : 'api.muusik.app'}/find-user?user=${encodeURIComponent(
				session?.user.user_metadata.provider_id
			)}`
		);
		const data = (await res.json()) as
			| { message: string; success: false }
			| { user: any; success: true };
		if (data.success) return data.success;
		else {
			return fail(res.status, { message: data.message });
		}
	}
</script>

<svelte:head>
	<title>Dashboard - muusik.app</title>
	<meta content="Dashboard | muusik.app" property="og:title" />
	<meta
		content="The dashboard for Muusik, an open-source Discord music bot"
		property="og:description"
	/>
	<meta content="https://muusik.app/dashboard" property="og:url" />
	<meta content="#3A015C" data-react-helmet="true" name="theme-color" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<meta name="description" content="The dashboard for Muusik, an open-source Discord music bot" />
</svelte:head>

<!-- <pre class="text-white">{JSON.stringify(songs, null, 4)}</pre> -->
{#await findUser()}
	<Loading />
{:then}
	<button
		><Icon
			src={Cog6Tooth}
			class="float-right m-5 text-white absolute right-0 top-0 w-10 h-auto lg:w-fit"
			solid
			size="68"
		/></button
	>
	<div class="flex flex-col justify-center h-screen mr-56 w-full -mt-6">
		<Queue bind:session bind:supabase bind:current />
		<div class="m-5">
			<SearchSong bind:session bind:current />
			<StatusBar bind:session bind:current />
		</div>
	</div>
{/await}
