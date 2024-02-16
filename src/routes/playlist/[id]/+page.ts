import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
	type Playlist = {
		id: string;
		created_at: string;
		name: string;
		songs: Array<{
			url: string;
			metadata: {
				name: string;
				artist: string;
				duration: string;
				image: string;
			};
		}>;
		owner: string;
	};
	const { id } = params;
	const { supabase } = await parent();
	const { data, error: supabaseerror } = (await supabase
		.from('playlist')
		.select('*')
		.eq('id', id)
		.single()) as { data: Playlist; error: any };
	if (supabaseerror) {
		console.log(supabaseerror)
		error(404, { message: 'Playlist not found' });
	}
	return { playlist: data, id };
}) satisfies PageLoad;
