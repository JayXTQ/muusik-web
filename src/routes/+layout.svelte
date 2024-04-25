<script>
	import '../app.postcss';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { DarkMode } from 'flowbite-svelte';
	import Cookies from '$lib/components/Cookies.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
			// @ts-ignore
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<DarkMode class="absolute top-5 left-5" size="lg" />

<slot />

<!-- <Cookies /> -->
