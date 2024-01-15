<script lang="ts">
    import { Heading } from "flowbite-svelte";

    export let queue: any[] = [];
    export let history: any[] = [];
    export let current: any;
    export let text: string;

	function checkCurrent() {
		if (JSON.stringify(current) === JSON.stringify({})) return false;
		else return true;
	}
</script>

<Heading tag="h2" class="text-white font-inter h-fit m-4 w-fit grow"
    >{queue.length}{text}{history.length + queue.length !== 0
        ? history.length + queue.length + 1
        : checkCurrent()
        ? 1
        : 0}</Heading
>