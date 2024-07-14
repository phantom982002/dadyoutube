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
        <div className="p-5">
            <div className="p-2 w-full">
                <h1 className="text-lg pb-2">Searching channel <b>{channelVideos.channel?.snippet?.title}</b></h1>
                <input type="text" className="border rounded-xl shadow p-2 w-full" onChange={e => setQuery(e.target.value)}  value={query} />
            </div>
            <div className="overflow-scroll max-h-screen">
                <ul className="">
                    {channelVideos?.playlistItems?.filter(
                        (c: any) => !c || c.snippet.title.toLowerCase().indexOf(query.toLowerCase()) != -1
                    ).map(
                        (c: any) => (
                            <li className="m-5 block border" key={c.id}>
                                <a href={`https://youtube.com/watch?v=${c.contentDetails.videoId}`} target="_blank">
                                <img src={c.snippet.thumbnails?.medium?.url} />
                                
                                {c.snippet.title}
                                <p className="text-sm"><b>Playlist: </b>{c.playlistDetail.snippet.title}</p>
                                </a>
                            </li>
                        )
                    )}
                </ul>
            </div>
        </div>
    );
}