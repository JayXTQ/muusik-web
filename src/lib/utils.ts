import type { Session } from '@supabase/supabase-js';
import { dev } from '$app/environment';
import type { APITrack, APIUser } from './types';

export async function checkPlaying(session: Session | null) {
    const res = await fetch(
        `//${dev ? 'localhost:8000' : 'api.muusik.app'}/check-playing?user=${encodeURIComponent(
            session?.user.user_metadata.provider_id
        )}`
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

export async function getUser(user: string) {
    const res = await fetch(`//${dev ? 'localhost:8000' : 'api.muusik.app'}/get-user?user=${user}`);
    const data = (await res.json()) as
        | { message: string; success: false }
        | { user: APIUser; success: true };
    if (data.success) {
        console.log(data.user)
        return data.user;
    }
    else {
        return null;
    }
}

export async function getQueue(session: Session | null) {
    const res = await fetch(
        `//${dev ? 'localhost:8000' : 'api.muusik.app'}/queue?user=${encodeURIComponent(
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
                    return { ...q, requestedBy: (await getUser(q.requestedBy as string) as APIUser).username };
                })
            )) || [];
        history =
            (await Promise.all(
                data.history.map(async (q) => {
                    return { ...q, requestedBy: (await getUser(q.requestedBy as string) as APIUser).username };
                })
            )) || [];
    } else {
        return null;
    }
    return { queue, history };
}

export function checkExists(value: Record<string, unknown>) {
    if (JSON.stringify(value) === JSON.stringify({})) return false;
    else return true;
}

export async function currentSong(session: Session | null, current: APITrack, currentElapsed: number, playingSong: boolean, skip?: boolean) {
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
        `//${dev ? 'localhost:8000' : 'api.muusik.app'}/current-song?user=${encodeURIComponent(
            session?.user.user_metadata.provider_id
        )}`
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