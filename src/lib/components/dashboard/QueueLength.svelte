<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { checkExists } from '$lib/utils';
	import type { APITrack } from '$lib/types';

	export let queue: APITrack[] = [];
	export let history: APITrack[] = [];
	export let current: APITrack;
	export let text: string;
</script>

<Heading tag="h2" class="text-white font-inter h-fit m-4 w-fit grow"
	>{queue.length}{text}{history.length + queue.length !== 0
		? history.length + queue.length + 1
		: checkExists(current)
		? 1
		: 0}</Heading
>
