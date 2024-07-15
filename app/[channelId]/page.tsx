'use client'

import { getAllData } from "@/app/actions";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { channelId: string } }) {
    const [channelVideos, setChannelVideos] = useState([] as any);
    const [query, setQuery] = useState('');
    useEffect(
        () => {
            const getData = async () => {
                const data = await getAllData(params.channelId);
                setChannelVideos(
                    data
                );
                console.log(data.channel);
            };
            getData();
        },
        [params.channelId, setChannelVideos]
    )
    return (
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="p-2 w-full">
                <h1 className="text-lg pb-2">Searching channel <b>{channelVideos.channel?.snippet?.title}</b></h1>
                <input type="text" className="border rounded-xl shadow p-2 w-full" onChange={e => setQuery(e.target.value)} value={query} />
            </div>
                <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {channelVideos?.playlistItems?.filter(
                        (c: any) => !c || c.snippet.title.toLowerCase().indexOf(query.toLowerCase()) != -1
                    ).map(
                        (c: any) => (
                            <li key={c.id} className="relative">
                                <a href={`https://youtube.com/watch?v=${c.contentDetails.videoId}`} target="_blank">
                                    <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                        <img alt="" src={c.snippet.thumbnails?.medium?.url} className="w-full pointer-events-none object-cover group-hover:opacity-75" />
                                    </div>
                                    <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{c.snippet.title}</p>
                                    <p className="pointer-events-none block text-sm font-medium text-gray-500">{c.playlistDetail.snippet.title}</p>
                                </a>
                            </li>

                        )
                    )}
                </ul>
        </div>
    );
}