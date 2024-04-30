<script>
	import { page } from '$app/stores';
	import { P, Heading, Button, A } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Error! - muusik.app</title>
</svelte:head>

<Heading tag="h1" class="text-4xl font-bold text-center mt-20"
	>{String($page.status).startsWith('5') ? 'Something went wrong!' : $page.error?.message}</Heading
>
<br />
<P class="text-center"
	>Maybe check if the muusik.app API is down? <A
		class="text-blue-600"
		href="https://status.jayxtq.xyz">Status page</A
	></P
>
<br />

<Button color="purple" href="/" class="flex w-fit mx-auto mb-4">Home</Button>
<Button color="purple" href={$page.url.href} class="flex w-fit mx-auto">Back</Button>
