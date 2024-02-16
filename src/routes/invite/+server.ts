import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    redirect(302, 'https://discord.com/api/oauth2/authorize?client_id=1137124050792087682&permissions=36702208&scope=bot+applications.commands');
};