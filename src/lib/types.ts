export type Songs = {
    tracks: {
        track: Tracks;
    }
}

export type Tracks = Array<{
    name: string;
    artist: string;
    url: string;
    streamable: string;
    listeners: string;
    image: Array<{
        '#text': string;
        size: string;
    }>;
    mbid: string;
}>