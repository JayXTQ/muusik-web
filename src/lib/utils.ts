import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { dev } from '$app/environment';
import type { APITrack, APIUser } from './types';

export async function checkPlaying(session: Session | null, supabase: SupabaseClient) {
	const res = await fetch(
		`${
			dev ? '//localhost:8000' : await getAPI(supabase, session)
		}/check-playing?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`
	);
	const data = (await res.json()) as
		| { message: string; success: false }
		| { playing: boolean; success: true };
	if (data.success) {
		return data.playing;
	} else {
		return false;
	}
}

export async function getUser(user: string, supabase: SupabaseClient, session: Session | null) {
	const res = await fetch(
		`${dev ? '//localhost:8000' : await getAPI(supabase, session)}/get-user?user=${user}`
	);
	const data = (await res.json()) as
		| { message: string; success: false }
		| { user: APIUser; success: true };
	if (data.success) {
		return data.user;
	} else {
		return null;
	}
}

export async function getQueue(session: Session | null, supabase: SupabaseClient) {
	const res = await fetch(
		`${dev ? '//localhost:8000' : await getAPI(supabase, session)}/queue?user=${encodeURIComponent(
			session?.user.user_metadata.provider_id
		)}`
	);
	const data = (await res.json()) as
		| { message: string; success: false }
		| { queue: APITrack[]; history: APITrack[]; success: true };

	let queue: APITrack[] = [];
	let history: APITrack[] = [];
	if (data.success) {
		queue =
			(await Promise.all(
				data.queue.map(async (q) => {
					return {
						...q,
						requestedBy: ((await getUser(q.requestedBy as string, supabase, session)) as APIUser)
							.username
					};
				})
			)) || [];
		history =
			(await Promise.all(
				data.history.map(async (q) => {
					return {
						...q,
						requestedBy: ((await getUser(q.requestedBy as string, supabase, session)) as APIUser)
							.username
					};
				})
			)) || [];
	} else {
		return { queue, history };
	}
	return { queue, history };
}

export function checkExists(value: Record<string, unknown>) {
	if (JSON.stringify(value) === JSON.stringify({})) return false;
	else return true;
}

export async function currentSong(
	session: Session | null,
	current: APITrack,
	currentElapsed: number,
	playingSong: boolean,
	supabase: SupabaseClient,
	skip?: boolean
) {
	if (
		currentElapsed - 1000 < (current.durationMS as number) &&
		playingSong &&
		millisToMinutesAndSeconds(currentElapsed) !== current.duration &&
		!skip
	) {
		currentElapsed += 1000;
		return { current, currentElapsed, playingSong };
	}
	const res = await fetch(
		`${
			dev ? '//localhost:8000' : await getAPI(supabase, session)
		}/current-song?user=${encodeURIComponent(session?.user.user_metadata.provider_id)}`
	);
	const data = (await res.json()) as
		| { message: string; success: false }
		| {
				song: APITrack;
				currentTrackTimeElapsed: number;
				trackLyrics: { lyrics: string };
				success: true;
		  };
	let currentLyrics = '';
	if (data.success) {
		current = data.song;
		currentElapsed = data.currentTrackTimeElapsed;
		currentLyrics = data.trackLyrics.lyrics;
		playingSong = true;
	} else {
		current = {};
		currentElapsed = 0;
		currentLyrics = 'No lyrics found';
		playingSong = false;
	}
	if (!current || !current.title) {
		current = {};
		currentElapsed = 0;
		currentLyrics = 'No lyrics found';
		playingSong = false;
	}
	return { current, currentElapsed, currentLyrics, playingSong };
}

export function millisToMinutesAndSeconds(millis: number) {
	const d = new Date(Date.UTC(0, 0, 0, 0, 0, 0, millis)),
		parts = [d.getUTCMinutes(), d.getUTCSeconds()],
		formatted = parts.map((s) => String(s).padStart(2, '0')).join(':');
	if (formatted === 'NaN:NaN') return '00:00';
	return formatted;
}

export async function getAPI(
	supabase: SupabaseClient,
	session: Session | null,
	returnProtocol = false,
	fetchAPI = fetch
): Promise<string> {
	if (window && window.sessionStorage.getItem('api'))
		return !returnProtocol
			? (window.sessionStorage.getItem('api') as string)
			: (window.sessionStorage.getItem('api')?.split('//')[1] as string);
	if (!session) return !returnProtocol ? 'https://api.muusik.app' : 'api.muusik.app';
	const guild = await fetchAPI(
		`//${dev ? 'localhost:8000' : 'api.muusik.app'}/find-user?user=${encodeURIComponent(
			session.user.user_metadata.provider_id
		)}`
	);
	const data = (await guild.json()) as
		| { message: string; success: false }
		| { success: true; guild: string | { id: string } };
	if (!data.success) return !returnProtocol ? 'https://api.muusik.app' : 'api.muusik.app';
	const { data: data_, error } = (await supabase
		.from('guilds')
		.select('settings')
		.eq('id', typeof data.guild !== 'string' ? data.guild.id : data.guild)
		.single()) as { data: { settings: { api: string } }; error: unknown };
	if (error) return !returnProtocol ? 'https://api.muusik.app' : 'api.muusik.app';
	if (window) window.sessionStorage.setItem('api', data_.settings.api);
	return !returnProtocol ? data_.settings.api : data_.settings.api.split('//')[1];
}
