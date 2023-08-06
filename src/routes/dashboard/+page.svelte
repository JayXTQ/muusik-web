<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
    let fragment = new URLSearchParams($page.url.href.split("#")[1]);
	const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
    let user: any;
    if(accessToken && tokenType){
        user = fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${tokenType} ${accessToken}`,
                },
        }).then(res => res.json()).then(res => {
            if(browser){
                window.localStorage.setItem('accessToken', accessToken);
                window.localStorage.setItem('tokenType', tokenType);
            }
        })
    } 
    if (browser && window.localStorage.getItem('accessToken') && window.localStorage.getItem('tokenType')){
        user = fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`,
            },
        }).then(res => res.json())
    } else {
        if(browser)
        goto('//api.muusik.app/login');
    }
</script>

{#await user then u}
    <pre>{JSON.stringify(user, null, 4)}</pre>
{/await}