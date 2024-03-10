import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { getAPI } from '$lib/utils';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE)

export const actions: Actions = {
    default: async ({ fetch, locals, request }) => {
        const session = await locals.getSession();
        if(!session) return { status: 401, body: 'Unauthorized' }
        const json = Object.fromEntries(await request.formData())
        let guildoptions: Record<string, string> = {};
        let guild: boolean = false;
        for(const key in json) {
            if(key.includes('guild')) {
                guild = true;
                guildoptions[key.replace("guild", "")] = json[key] as string;
                delete json[key];
            }
        }
        if(guild){
            const res = await fetch(`//${dev ? 'localhost:8000' : await getAPI(supabase, session)}/get-owner?user=${encodeURIComponent(session.user.user_metadata.provider_id)}`)
            const data_ = await res.json() as {
                success: false; message: string
            } | {
                success: true; owner: string; guild: string;
            };
            if(!data_.success) return;
            if(data_.owner !== session.user.user_metadata.provider_id){
                return;
            }
            if(guildoptions.api){
                const res = await fetch(`${guildoptions.api}/get-owner?user=${encodeURIComponent(session.user.user_metadata.provider_id)}`)
                const data_ = await res.json() as {
                    success: false; message: string
                } | {
                    success: true; owner: string; guild: string;
                };
                if(!data_.success) return;
            }
            const { data, error } = await supabase.from('guilds').upsert({ id: data_.guild, settings: guildoptions }, { onConflict: 'id' })
            if(error) console.log(error)
        }
    }
};

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const session = await locals.getSession();
    const api = await getAPI(supabase, session, false, fetch);
    let owner = false;
    let guildId = '';
    let guildsettings: {
        api: string;
    } = {
        api
    }
    const res = await fetch(`//${dev ? 'localhost:8000' : api}/get-owner?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`);
    const data_ = (await res.json()) as
        | { message: string; success: false }
        | { owner: string; guild: string; success: true };
    if (data_.success) {
        owner = data_.owner === session?.user.user_metadata.provider_id;
        guildId = data_.guild;
    }
    const { data, error } = await supabase.from('guilds').select('settings').eq('id', guildId).single() as { data: { settings: { api: string } }, error: any };
        if(error){
            guildsettings = {
                api: 'https://api.muusik.app'
            }
        } else {
            guildsettings = {
                api: data.settings.api || 'https://api.muusik.app'
            };
        }
    return {
        owner,
        guildId,
        guildsettings
    }
};