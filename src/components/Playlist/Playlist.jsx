import { useState } from 'react'
import spotifyIcon from '../../assets/spotify-icon.svg'
import songCoverArt from '../../assets/song-cover-art.svg'
import './Playlist.css'
import MusicPlayerButton from '../MusicPlayerButton/MusicPlayerButton'


const SongInfo = {
    song_title: "It Goes Like NaNaNa",
    song_artist: "Greg Foat, Gigi Massin",
    song_cover_art: songCoverArt
}


function Playlist() {

  return (
    <>
        <div className="playlist-header">
         <div className="playlist-section-label">
            <img src={spotifyIcon} className="playlist-icon" alt="Playlist Icon" />
            <p className="playlist-label"> Camp Tunes </p>
          </div>
          <div className="playlist-actions">
            <p className="actions-text"> Queue </p>
          </div>
        </div>
          <div className="song-section">
          <img src={SongInfo.song_cover_art} className="song-cover" alt="Song Cover" />
          <div className="song-info">
              <p className="song-title">
                 {SongInfo.song_title}
              </p>
              <p className="song-artist"> {SongInfo.song_artist} </p>
          </div>
          <div className="music-button">
            <MusicPlayerButton />
          </div>
        </div>
    </>
  )
}

export default Playlist
