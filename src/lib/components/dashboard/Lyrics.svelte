<script lang="ts">
    import { Icon, ChatBubbleBottomCenterText } from "svelte-hero-icons";
    import { Modal } from "flowbite-svelte";

    $: innerWidth = 0;

    let lyricsModal = false;
    export let currentLyrics: string;
</script>

<svelte:window bind:innerWidth />

{#if innerWidth >= 640}
    <button class="my-auto w-auto" on:click={() => (lyricsModal = true)}>
        <Icon src={ChatBubbleBottomCenterText} class="text-white" size="70" solid />
    </button>
{/if}
<Modal title="Lyrics" class="max-h-[50dvh] overflow-auto" bind:open={lyricsModal}>
    <pre class="font-inter">{currentLyrics}</pre>
</Modal>