import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase }, params }) => {
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
		owner: string[];
	};
	const { id } = params;
	const { data, error: supabaseerror } = (await supabase
		.from('playlist')
		.select('*')
		.eq('id', id)
		.single()) as { data: Playlist; error: any };
	if (supabaseerror) {
		throw new Error(supabaseerror.message);
	}
	return json(data);
};
