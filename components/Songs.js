import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Song from "./Song"

function Songs() {
    const playlist = useRecoilValue(playlistState)
    const spotifyApi = useSpotify()
    const [tracks, setTracks] = useState(null)


    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getPlaylist(playlist?.id).then(data => {
                setTracks(data.body)
            })
        }
    }, [spotifyApi, playlist])


    return (
        <div className="text-white px-8 flex flex-col space-y-1 pb-28 mt-10" >
            {tracks?.tracks.items.map((track, i) => (
                <Song key={track.track.id} track={track.track} order={i}/>
            ))}
        </div> 
    )
}

export default Songs