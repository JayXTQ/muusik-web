<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
    let fragment = new URLSearchParams($page.url.href.split("#")[1]);
	const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
    if(accessToken && tokenType){
        fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${tokenType} ${accessToken}`,
                },
        }).then(res => res.json()).then(res => {
            if(browser){
                window.localStorage.setItem('user', JSON.stringify(res.id));
            }
        })
    } 
    if (browser && window.localStorage.getItem('user')){
        goto('/dashboard');
    } else if(browser) {
        goto('//api.muusik.app/login');
    }
</script>