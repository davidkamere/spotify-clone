import { useEffect, useState } from "react";
import { playlistState } from "../atoms/playlistAtom" 
import { useRecoilState } from "recoil";
import Songs from "../components/Songs"
import { signOut, useSession } from "next-auth/react";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
]

function Center () {
    const { data: session } = useSession();
    const [color, setColor] = useState(null)
    const [playlist] = useRecoilState(playlistState)


    useEffect(() => {
        setColor(colors[Math.floor(Math.random()*7)])
    }, [playlist])


    return (
        <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2" onClick={signOut}>
                    <img className="rounded-full w-10 h-10" src={session?.user.image} alt=""/>
                    <h2>{session?.user.name}</h2>
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}>
               {playlist ? <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt=''/> : <p></p>}
               <div>

                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                        {playlist ? playlist.name : <p>Select a playlist</p>}
                    </h1>
               </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center