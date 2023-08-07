<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import {
		P,
		Heading,
		Button,
		A,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Input,
		Avatar
	} from 'flowbite-svelte';
	import { Icon, Cog6Tooth, Pause, Forward } from 'svelte-hero-icons';
	let fragment = new URLSearchParams($page.url.href.split('#')[1]);
	const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
	let user: any;
	if (accessToken && tokenType) {
		user = fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: `${tokenType} ${accessToken}`
			}
		}).then((res) => res.json());
		if (browser) {
			window.localStorage.setItem('accessToken', accessToken);
			window.localStorage.setItem('tokenType', tokenType);
		}
	}
	if (browser) {
		if (
			window.localStorage.getItem('accessToken') &&
			window.localStorage.getItem('tokenType') &&
			!user
		)
			user = fetch('https://discord.com/api/users/@me', {
				headers: {
					Authorization: `${tokenType} ${accessToken}`
				}
			}).then((res) => res.json());
		else if (
			!window.localStorage.getItem('accessToken') &&
			!window.localStorage.getItem('tokenType') &&
			!user
		)
			goto('//api.muusik.app/login');
	}
	let songs: any = [];
	async function searchSong(e: any) {
		e.preventDefault();
		const query = e.target.value;
		const res = await fetch(`//localhost:5714/find-song?query=${query}`);
		const data = await res.json();
		if (data.success) {
			songs = data.song.slice(0, 5);
		}
	}
</script>

<button on:click={searchSong} value="blinding lights"
	><Icon
		src={Cog6Tooth}
		class="float-right m-5 text-white absolute right-0 top-0"
		solid
		size="68"
	/></button
>

<svelte:head>
	<title>Dashboard - muusik.app</title>
	<meta content="Dashboard | muusik.app" property="og:title" />
	<meta
		content="The dashboard for Muusik, an open-source Discord music bot"
		property="og:description"
	/>
	<meta content="https://muusik.app/dashboard" property="og:url" />
	<meta content="#3A015C" data-react-helmet="true" name="theme-color" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<meta name="description" content="The dashboard for Muusik, an open-source Discord music bot" />
</svelte:head>

<pre class="text-white">{JSON.stringify(songs, null, 4)}</pre>

{#await user then u}
	<!-- <pre>{JSON.stringify(u, null, 4)}</pre> -->

	<div class="flex flex-col justify-center h-screen mr-56 w-full -mt-6">
		<div class="bg-primary-100 rounded-xl mx-[5.63rem] grow max-h-96 flex-col flex">
			<div class="flex m-4">
				<Heading tag="h2" class="text-white font-inter grow">The Queue</Heading>
				<Heading tag="h2" class="text-white font-inter w-fit">{u.username}</Heading>
			</div>
			<div class="grow">
				<Table color="custom" class="text-white font-inter">
					<TableHead>
						<TableHeadCell>Track</TableHeadCell>
						<TableHeadCell>Artist</TableHeadCell>
						<TableHeadCell>Album</TableHeadCell>
						<TableHeadCell>Duration</TableHeadCell>
						<TableHeadCell>Added By</TableHeadCell>
					</TableHead>
					<TableBody>
						<!-- {#each data.queue as track}
                            <TableBodyRow>
                                <TableBodyCell>{track.name}</TableBodyCell>
                                <TableBodyCell>{track.artist}</TableBodyCell>
                                <TableBodyCell>{track.album}</TableBodyCell>
                                <TableBodyCell>{track.duration}</TableBodyCell>
                                <TableBodyCell>{track.addedBy}</TableBodyCell>
                            </TableBodyRow>
                        {/each} -->
					</TableBody>
				</Table>
			</div>
			<Heading tag="h2" class="text-white font-inter h-fit m-4 w-fit">x songs left out of x</Heading
			>
		</div>

		<Input
			size="lg"
			type="text"
			name="query"
			placeholder="Search"
			class="bg-primary-100 text-white mx-auto rounded-xl mt-8 font-inter border-primary-200 border-4 w-full xl:max-w-[48.9rem]"
			on:change={searchSong}
		/>

		<div class="bg-primary-300 mx-auto flex rounded-[0.625rem] mt-8 w-full xl:max-w-[48.9rem]">
			<Avatar rounded src="/gasoline.png" class="h-[5rem] my-auto w-auto ml-[0.94rem]" />
			<div class="my-auto h-[7.5rem] ml-4 grow flex">
				<div class="my-auto">
					<P class="font-inter text-white text-3xl">Gasoline</P>
					<P class="font-inter text-white text-2xl">The Weeknd</P>
					<P class="font-inter text-white text-1xl">Dawn FM</P>
				</div>
			</div>
			<Icon src={Pause} class="text-white w-auto my-auto" size="70" />
			<div class="my-auto mr-[2.48rem]">
				<Icon src={Forward} class="text-white w-auto" solid size="70" />
				<P class="font-inter text-white text-center absolute w-[70px]">0/1</P>
			</div>
		</div>
	</div>
{/await}
