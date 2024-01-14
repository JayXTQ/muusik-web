import { error, fail } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async ({ parent, params }) => {
    const { supabase, session } = await parent()
    const { data, error: supabaseerror } = await supabase.from('playlist').select('name,id').eq('owner', session?.user.id) as { data: { name: string, id: string }[], error: any };
    if (supabaseerror) {
        throw error(400, { message: 'Error' });
    }
    return { playlists: data };
}) satisfies PageLoad;