<script lang="ts">
    export let current: {
        title: string;
        author: string;
        duration: string;
    }
    import { P } from "flowbite-svelte";
</script>

<div class="my-auto h-[7.5rem] ml-4 grow flex w-fit max-w-[40%] md:max-w-full">
    <div class="my-auto">
        <P class="font-inter text-white text-3xl whitespace-nowrap truncate"
            >{current.title}</P
        >
        <P class="font-inter text-white text-2xl whitespace-nowrap truncate"
            >{current.author}</P
        >
        <P class="font-inter text-white text-xl"
            >{current.duration}</P
        >
    </div>
</div>