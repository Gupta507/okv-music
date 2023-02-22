import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../api/getAudio';
import Header from '../../components/header/Header';
import { useGetSongsByIdQuery } from '../../reduxtool/services/songsApi';
import './Player.css'
import PlayerControls from './playerControls/PlayerControls';
import RelatedSongs from './relatedSongs/RelatedSongs';



const Player = () => {
  const [songUrl, setSongUrl] = useState('');
  const [songsInfo, setSongsInfo] = useState([]);
  const [audioLoading, setAudioLoading] = useState(true);
  const { id } = useParams()
  const { data, isLoading, isError } = useGetSongsByIdQuery(id);

  const [progress, setProgress] = useState(0);

  const audioRef = useRef();


  const getSongUrl = async () => {
    try {
      const response = await fetch(`${baseUrl}/song?id=${id}`, {
        method: "GET",
      })
      const data = await response.json()
      // console.log(data)
      setSongUrl(data)
      // setAudioLoading(false)

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getSongUrl();
    setProgress(0)
  }, [id])

  useEffect(() => {
    if (data) {
      setSongsInfo(data.items)
    }
  }, [data])


 

  const onPlaying = () => {
    const duration = audioRef.current.duration;
    const currTime = audioRef.current.currentTime;
    // console.log(duration,currTime)
    setProgress(currTime / duration * 100);

  }
 
  






  return (
    <div className="player-page-section">
      <Header />
      <div className='player-section '>

        <div className="player-container">
          <div className="player-song-image-wrapper">
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt="song-poster"
              className='player-song-image'
            />
          </div>
          <div className="player-song-title-channel-wrapper absolute-center">
            <div className="player-song-title">
              {songsInfo[0]?.snippet?.title}
            </div>
            <div className="player-song-channel">
              • {songsInfo[0]?.snippet?.channelTitle}
            </div>
          </div>

          <audio src={songUrl} ref={audioRef} onTimeUpdate={onPlaying} onLoadedMetadata={()=>setAudioLoading(false)} />

          <PlayerControls audioRef={audioRef}
            progress={progress}  audioLoading={audioLoading} 
            audioDuration={songsInfo[0]?.contentDetails?.duration}
          
             />


        </div>
        {isError && <div>{isError}</div>}

         <RelatedSongs videoId={id}/>
      </div>

     
    </div>
  )
}

export default Player