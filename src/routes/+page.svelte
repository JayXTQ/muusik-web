<script lang="ts">
	import { P, Heading, Button, Secondary, A, Avatar, List, Li } from 'flowbite-svelte';
	import * as Components from '$lib/components';
	import { Icon, Pause, Forward, MagnifyingGlass } from 'svelte-hero-icons';
</script>

<svelte:head>
	<title>muusik.app</title>
	<meta content="muusik.app" property="og:title" />
	<meta content="Muusik, an open-source Discord music bot" property="og:description" />
	<meta content="https://muusik.app/" property="og:url" />
	<meta content="#3A015C" data-react-helmet="true" name="theme-color" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<meta
		name="description"
		content="Muusik, an open-source Discord music bot with an interactive dashboard"
	/>
</svelte:head>

<div class="w-full p-5 bg-red-600">
	<P class="text-white font-inter text-center"
		>Hello, currently this is still in development, but check out our Discord <A
			href="https://discord.gg/TjQ7age85Y"
			class="text-blue-500">here</A
		>. It still works, just may not be up to standards</P
	>
</div>
<div class="h-screen w-full flex justify-center items-center">
	<div>
		<Heading tag="h1" class="text-white text-center font-inter italic invisible text-7xl"
			>The best <span class="visible opacity-[33%]">music</span> bot</Heading
		>
		<Heading tag="h1" class="text-white text-center font-inter text-7xl"
			>The best muusik bot</Heading
		>
		<P class="text-white text-center font-inter mt-0.5 text-3xl"
			>Get that Friday feeling on all week.</P
		>
		<br class="h-4" />
		<div class="flex flex-col items-center gap-1">
			<Button class="bg-primary-400 font-inter text-3xl" size="xl" href="/dashboard">Get started</Button><br>
			<A class="font-inter text-3xl" href="https://discord.com/api/oauth2/authorize?client_id=1137124050792087682&permissions=36702208&scope=bot+applications.commands">Add the bot</A>
			<Secondary class="font-inter text-3xl">or</Secondary>
			<A class="text-white font-inter text-3xl" href="#learn-more">Learn more</A>
		</div>
	</div>
</div>
<div class="m-[2rem] lg:space-y-[14.81rem] space-y-20">
	<div class="gap-[1.38rem] flex xl:flex-row flex-col" id="learn-more">
		<div class="xl:w-5/12">
			<Heading tag="h2" class="text-white font-inter text-5xl">Personal DJ</Heading>
			<br />
			<P class="text-white font-inter text-4xl"
				>Have a song in mind? Give it to us via your dashboard and we’ll do the rest.</P
			>
		</div>
		<Components.HomeBox class="xl:w-7/12 flex items-center lg:h-[25.5rem] h-56"
			><div class="my-auto mx-16 bg-primary-300 w-full lg:h-[9.5rem] h-20 flex rounded-[0.625rem]">
				<Avatar rounded src="/gasoline.webp" class="lg:h-[7.5rem] h-16 my-auto w-auto ml-[0.94rem]" height="64px" width="64px" />
				<div class="my-auto lg:h-[7.5rem] h-16 ml-4 grow">
					<P class="font-inter text-white lg:text-5xl text-md">Gasoline</P>
					<P class="font-inter text-white lg:text-3xl text-sm">The Weeknd</P>
					<P class="font-inter text-white lg:text-2xl text-xs">Dawn FM</P>
				</div>
				<Icon src={Pause} class="text-white lg:h-[4.75rem] h-12 w-auto my-auto -mr-16 lg:-mr-0" />
				<div class="my-auto lg:mr-[2.48rem] m-0 lg:visible invisible">
					<Icon src={Forward} class="text-white h-[4.75rem] w-auto" solid />
					<P class="font-inter text-white text-center absolute w-[4.75rem]">0/1</P>
				</div>
			</div></Components.HomeBox
		>
	</div>
	<div class="gap-[1.38rem] flex xl:flex-row flex-col">
		<Components.HomeBox class="xl:w-7/12 flex flex-col items-center lg:h-[34.875rem] h-[25rem]"
			><div class="my-auto w-full space-y-[0.81rem]">
				<div
					class="mx-8 bg-primary-100 w-auto lg:h-[7.625rem] h-12 flex rounded-[1.25rem] border-primary-200 border-[5px]"
				>
					<Icon src={MagnifyingGlass} class="text-[#715E5E] lg:h-[5rem] h-6 w-auto my-auto ml-[0.94rem]" />
					<P class="text-white font-inter my-auto lg:text-4xl text-xl ml-[0.62rem]">Blinding Lights</P>
				</div>
				<div
					class="mx-8 bg-primary-100 w-auto lg:h-[24.5625rem] rounded-[1.25rem] flex border-primary-200 border-[5px] overflow-hidden"
				>
					<div class="grow my-[1.06rem]">
						<div class="flex">
							<Avatar rounded src="/bl1.webp" class="lg:h-[7.5rem] h-16 my-auto w-auto ml-[0.94rem]" height="64px" width="64px" />
							<div class="my-auto lg:h-[7.5rem] h-16 ml-4 grow">
								<P class="font-inter text-white lg:text-5xl text-md truncate">Blinding Lights</P>
								<P class="font-inter text-white lg:text-4xl text-sm truncate">The Weeknd</P>
								<P class="font-inter text-white lg:text-3xl text-xs truncate">After Hours</P>
							</div>
							<img
								class="text-white lg:h-14 h-6 w-auto my-auto mr-[1.55rem]"
								src="/spotify.svg"
								alt="Spotify"
							/>
							<img class="text-white lg:h-14 h-6 w-auto my-auto lg:mr-10 mr-4" src="/youtube.svg" alt="Youtube" />
						</div>
						<div class="flex mt-[1.06rem]">
							<Avatar rounded src="/bl2.webp" class="lg:h-[7.5rem] h-16 my-auto w-auto ml-[0.94rem]" height="64px" width="64px" />
							<div class="my-auto lg:h-[7.5rem] h-16 ml-4 grow">
								<P class="font-inter text-white lg:text-5xl text-md truncate">City of blindi...</P>
								<P class="font-inter text-white lg:text-4xl text-sm truncate">U2</P>
								<P class="font-inter text-white lg:text-3xl text-xs truncate"
									>How to dismantle an...</P
								>
							</div>
							<img
								class="text-white lg:h-14 h-6 w-auto my-auto mr-[1.55rem]"
								src="/spotify.svg"
								alt="Spotify"
							/>
							<img class="text-white lg:h-14 h-6 w-auto my-auto lg:mr-10 mr-4" src="/youtube.svg" alt="Youtube" />
						</div>
						<div class="flex mt-[1.06rem]">
							<Avatar rounded src="/bl3.webp" class="lg:h-[7.5rem] h-16 my-auto w-auto ml-[0.94rem]" height="64px" width="64px" />
							<div class="my-auto lg:h-[7.5rem] h-16 ml-4 grow w-full">
								<P class="font-inter text-white lg:text-5xl text-md truncate">Blinding Lights</P>
								<P class="font-inter text-white lg:text-4xl text-sm truncate">The Weeknd</P>
								<P class="font-inter text-white lg:text-3xl text-xs truncate">After Hours</P>
							</div>
							<img
								class="text-white lg:h-14 h-6 w-auto my-auto mr-[1.55rem]"
								src="/spotify.svg"
								alt="Spotify"
							/>
							<img class="text-white lg:h-14 h-6 w-auto my-auto lg:mr-10 mr-4" src="/youtube.svg" alt="Youtube" />
						</div>
					</div>
					<div class="h-auto rounded-full bg-[#312D2D] w-4 m-2">
						<div class="h-16 rounded-full bg-[#C6C6C6] w-full" />
					</div>
				</div>
			</div></Components.HomeBox
		>
		<div class="xl:w-5/12">
			<Heading tag="h2" class="text-white font-inter text-5xl lg:text-right">Quick Search</Heading>
			<br />
			<P class="text-white font-inter text-4xl lg:text-right"
				>We have lots of songs on multiple platforms. Search a song, choose the platform and play</P
			>
		</div>
	</div>
</div>
<div class="mt-10 m-8">
	<Heading tag="h2" class="text-inter text-white text-6xl">Other features</Heading>
	<List list="disc" class="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
		<Li class="text-4xl font-inter text-white">LastFM Integration</Li>
		<Li class="text-4xl font-inter text-white">Find only the best quality</Li>
		<Li class="text-4xl font-inter text-white">Premium features, for free</Li>
		<Li class="text-4xl font-inter text-white">Seamless connection</Li>
	</List>
</div>
<div class="flex justify-center mt-10">
	<Button class="bg-primary-400 font-inter text-3xl" size="xl" href="/dashboard">Interested?</Button><br>
	<A class="font-inter text-3xl" href="https://discord.com/api/oauth2/authorize?client_id=1137124050792087682&permissions=36702208&scope=bot+applications.commands">Add the bot</A>
</div>
<div class="w-full bg-[#0E0E0E] mt-20">
	<div class="flex mx-24 py-4">
		<div class="grow space-y-2">
			<Heading tag="h3" class="text-inter text-white text-5xl">Muusik</Heading>
			<P class="text-inter text-white text-2xl max-w-[25rem]"
				>A free, open-source Discord music bot</P
			>
			<div class="flex gap-4">
				<img src="/github.svg" alt="GitHub" class="h-12" /><a href="https://discord.gg/TjQ7age85Y"
					><img src="/discord.svg" alt="Discord" class="h-12" /></a
				>
			</div>
		</div>
		<div class="flex flex-col gap-2 my-auto">
			<A class="font-inter text-white text-xl" href="/terms">Terms and Conditions</A>
			<A class="font-inter text-white text-xl" href="/privacy">Privacy Policy</A>
		</div>
	</div>
</div>
