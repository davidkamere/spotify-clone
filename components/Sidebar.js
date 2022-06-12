import {HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon, LogoutIcon} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistState } from "../atoms/playlistAtom" 
import useSpotify from "../hooks/useSpotify"

function Sidebar(){
    const spotifyApi = useSpotify()
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState([])
    const [, setPlaylist] = useRecoilState(playlistState)


    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items)
                setPlaylist(data.body.items[0])
            })
        }
    }, [session, spotifyApi])

    return (
        <div className="text-gray-500 p-10 pb-36 text-xs border-r hidden border-gray-900 overflow-y-scroll h-screen scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] md:inline-flex">
           <div className="space-y-7">
               
                <button className="flex items-center space-x-1 hover:text-white">
                    <HomeIcon className="h-5 w-5"/>
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-1 hover:text-white">
                    <SearchIcon className="h-5 w-5"/>
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-1 hover:text-white">
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>



                <button className="flex items-center space-x-1 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-1 hover:text-white">
                    <HeartIcon className="h-5 w-5"/>
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-1 hover:text-white">
                    <RssIcon className="h-5 w-5"/>
                    <p>Your Episodes</p>
                </button>
                
                <hr className="border-t-[0.1px] border-gray-900"/>

                {playlists.map(playlist => (
                    <p onClick={() => setPlaylist(playlist)} key={playlist.id} className="cursor-pointer hover:text-white">{playlist.name}</p>
                ))}
                
                
           </div>
        </div>
    )
}

export default Sidebar
