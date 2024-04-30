import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { APIChannel } from '$lib/types';
import { getAPI } from '$lib/utils';
import { dev } from '$app/environment';

export const load: PageLoad = async ({ parent }) => {
	const { session, supabase } = await parent();

	if (!session) {
		await supabase.auth.signInWithOAuth({ provider: 'discord' });
	}

	const res = await fetch(
		`${
			dev ? '//localhost:8000' : await getAPI(supabase, session)
		}/find-user?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`
	);
	const data = (await res.json()) as
		| { message: string; success: false }
		| { channel: APIChannel; success: true };
	if (!data.success) {
		throw error(404, { message: data.message });
	}
};
