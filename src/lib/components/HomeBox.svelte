<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	let defaultClass: string;
	$: defaultClass = twMerge('border border-primary-light-300 dark:border-primary-dark-400 overflow-hidden rounded-lg', $$props.class);
</script>

<div class={defaultClass}><slot /></div>
