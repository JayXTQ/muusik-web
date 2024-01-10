import type { PageLoad } from './$types';

const prerender = false;
const ssr = false;

export const load = (async () => {
    return {};
}) satisfies PageLoad;