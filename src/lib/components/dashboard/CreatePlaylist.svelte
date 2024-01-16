<script lang="ts">
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { Modal, Input, Button } from 'flowbite-svelte';
	import { Icon, Plus } from 'svelte-hero-icons';

	export let supabase: SupabaseClient;
	export let history: any[];
	export let queue: any[];
	export let current: any;

	let createPlaylistModal = false;
	let playlistName = '';

	async function createPlaylist(name: string) {
		let songs: Array<{
			url: string;
			metadata: {
				name: string;
				artist: string;
				duration: string;
				image: string;
			};
		}> = [];
		for (const song of [...history, current, ...queue]) {
			songs.push({
				url: song.url,
				metadata: {
					name: song.title,
					artist: song.author,
					duration: song.duration,
					image: song.thumbnail
				}
			});
		}
		const { data, error } = await supabase
			.from('playlist')
			.insert({ name, songs })
			.select('id')
			.single();
		if (error || !data) console.error(error);
		else window.open(`/playlist/${data.id}`, '_blank');
	}
</script>

<button
	on:click={() => {
		createPlaylistModal = true;
		playlistName = '';
	}}
	class="p-1 m-auto"><Icon src={Plus} size="40" solid class="text-white" /></button
>
<Modal title="Create playlist" bind:open={createPlaylistModal}>
	<Input
		size="lg"
		type="text"
		name="query"
		placeholder="Playlist name"
		class="bg-primary-dark-100 text-white mx-auto rounded-xl mt-8 font-inter border-primary-dark-200 border-4 w-full xl:max-w-[48.9rem]"
		bind:value={playlistName}
	/>
	<Button
		color="green"
		class="font-inter w-full"
		size="lg"
		on:click={async () => createPlaylist(playlistName || 'Playlist')}>Create playlist</Button
	><br />
</Modal>
