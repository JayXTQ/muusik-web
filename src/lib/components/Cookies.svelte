<script lang="ts">
    import { Button, P, A } from 'flowbite-svelte';
    import { fly, slide } from 'svelte/transition';
    import { onMount } from 'svelte';

    let cookiesaccept = false;

    function setCookie(name: string, value: string, days: number) {
        let expires = '';
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        cookiesaccept = true;
    }

    function getCookie(name: string) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    onMount(() => {
        if(getCookie('cookiesAccepted')) {
            cookiesaccept = true;
        }
    });
</script>

{#if !cookiesaccept}
    <div class="flex justify-center items-center" transition:fly>
        <div class="fixed bg-white bottom-10 w-[50%] p-5 rounded-lg shadow-lg">
            <div class="flex">
                <P class="grow my-auto">muusik.app uses cookies to keep you logged in, read our <A href="/privacy">Privacy Policy</A> to learn more</P>
                <Button color="green" class="ml-5" on:click={() => { setCookie('cookiesAccepted', 'true', 365); cookiesaccept = true; }}>Accept cookies</Button>
            </div>
        </div>
    </div>
{/if}