'use server'

const key = process.env.YOUTUBE_API_KEY;
const ROOT_URL = 'https://www.googleapis.com/youtube/v3';

async function getPlaylists(channelId: string, ids: string[], pageToken?: string) {
    const parts = 'id,snippet,contentDetails';
    const size = 50;
    const selector = channelId ? `channelId=${channelId}` : `id=${ids.join(",")}`;
    const url = `${ROOT_URL}/playlists?part=${parts}&${selector}&key=${key}&maxResults=${size}${pageToken ? "&pageToken=" + pageToken : ""}`;
    const result = await fetch(url);
    return await result.json();
};

async function getFeaturedPlaylists(channelId: string) {
    const parts = 'id,snippet,contentDetails';
    const url = `${ROOT_URL}/channelSections?part=${parts}&channelId=${channelId}&key=${key}`;
    const result = await fetch(url);
    const sections = await result.json();
    const playlistIds = [];
    for(let section of sections.items) {
        const playlists = section?.contentDetails?.playlists;
        playlists && playlistIds.push(...playlists);
    }
    return playlistIds;
}

async function getPlaylistItems(playlistId: string, pageToken?: string) {
    const parts = 'id,snippet,contentDetails';
    const size = 50;
    const url = `${ROOT_URL}/playlistItems?part=${parts}&playlistId=${playlistId}&key=${key}&maxResults=${size}${pageToken ? "&pageToken=" + pageToken : ""}`;
    const result = await fetch(url);
    return await result.json();
};

export async function getChannelDetail(channelId: string) {
    const parts = 'id,snippet,contentDetails';
    const url = `${ROOT_URL}/channels?part=${parts}&id=${channelId}&key=${key}`;
    const result = await fetch(url);
    const channels = await result.json();    
    return channels.items[0];
}

export async function getAllPlaylists(channelId: string) {
    let items = [];
    let pageToken = undefined;
    let page;
    do {
        page = await getPlaylists(channelId, [], pageToken);
        items.push(...page.items);
        pageToken = page.nextPageToken;
    } while(pageToken);

    pageToken = undefined;
    const featuredPlaylistIds = await getFeaturedPlaylists(channelId);
    do {
        page = await getPlaylists('', featuredPlaylistIds, pageToken);
        items.push(...page.items);
        pageToken = page.nextPageToken;
    } while(pageToken);    
    return items;
}

export async function getAllPlaylistItems(playlistId: string) {
    let items = [];
    let pageToken = undefined;
    let page;
    do {
        page = await getPlaylistItems(playlistId, pageToken);
        items.push(...page.items);
        pageToken = page.nextPageToken;
    } while(pageToken);
    return items;
}

export async function getAllData(channelId: string) {
    const playlists = await getAllPlaylists(channelId);
    const playlistItems = []
    const seen = {} as {[key: string]: boolean};
    for(let playlist of playlists) {
        const playlistId: string = playlist.id;
        if(seen[playlistId]) {
            continue;
        }
        seen[playlistId] = true;
        const items = await getAllPlaylistItems(playlist.id);
        playlistItems.push(...items.map(i => ({...i, playlistDetail: playlist})));
    }
    return {channel: await getChannelDetail(channelId), playlistItems};
}