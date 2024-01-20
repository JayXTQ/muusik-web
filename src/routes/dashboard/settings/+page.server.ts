import type { Actions } from './$types';
import { dev } from '$app/environment';

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
            const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-owner?user=${encodeURIComponent(session.user.user_metadata.provider_id)}`)
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
            const { data, error } = await locals.supabase.from('guilds').upsert({ id: data_.guild, settings: guildoptions }, { onConflict: 'id' })
            if(error) console.log(error)
        }
    }
};