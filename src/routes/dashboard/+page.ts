import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async ({ url }) => {
	return {};
}) satisfies PageLoad;
