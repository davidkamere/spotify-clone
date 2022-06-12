import { useRecoilState } from "recoil"
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo"
import { useSession } from "next-auth/react";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom" 
import { useCallback, useEffect, useState } from "react";
import { ReplyIcon, SwitchHorizontalIcon, VolumeOffIcon } from "@heroicons/react/outline";
import { PauseIcon, PlayIcon, FastForwardIcon, RewindIcon, VolumeUpIcon } from "@heroicons/react/solid";
import { debounce } from 'lodash'

function Player () {
    const spotifyApi = useSpotify()
    const { data: session } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    const songInfo = useSongInfo()


    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500),
    [])

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play()
                setIsPlaying(true)
            }
        })

    }
    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item?.id)

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    useEffect (() => {
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackIdState, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100){
            debouncedAdjustVolume(volume)
        }
    }, [volume])

    return(
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">

            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt=""/>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            
            </div>
         
            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
                <RewindIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
                {isPlaying ? <PauseIcon onClick={handlePlayPause} className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>: <PlayIcon onClick={handlePlayPause} className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>}
                <FastForwardIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
                <ReplyIcon className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeOffIcon onClick={() => volume > 10 && setVolume(volume - 10)} className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
                <input className="w-14 md:w-28" type="range" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))}/>
                <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"/>
            </div>
        </div>
    )
}

export default Player