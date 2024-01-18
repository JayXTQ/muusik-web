export type Songs = {
	tracks: {
		track: Tracks;
	};
};

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
}>;

export type APITrack = {
	author: string;
	description: string;
	duration: string;
	durationMS: number;
	id: string;
	playlist: null;
	requestedBy: string;
	thumbnail: string;
	title: string;
	url: string;
	views: number;
} | {
	author?: string;
	description?: string;
	duration?: string;
	durationMS?: number;
	id?: string;
	playlist?: null;
	requestedBy?: string;
	thumbnail?: string;
	title?: string;
	url?: string;
	views?: number;
};

export type APIChannel = {
	bitrate: number;
	createdTimestamp: number;
	flags: number;
	guild: string;
	guildId: string;
	id: string;
	lastMessageId: string | null;
	messages: Array<unknown>;
	name: string;
	nsfw: boolean;
	parentId: string | null;
	permissionOverwrites: Array<string>;
	rateLimitPerUser: number;
	rawPosition: number;
	rtcRegion: string | null;
	type: number;
	userLimit: number;
	videoQualityMode: number | null;
}

export type APIUser = {
	avatar: string;
	avatarDescription: string | null;
	avatarURL: string;
	bot: boolean;
	createdTimestamp: number;
	defaultAvatarURL: string;
	descriminator: string;
	displayAvatarURL: string;
	flags: number;
	globalName: string;
	id: string;
	system: boolean;
	tag: string;
	username: string;
}