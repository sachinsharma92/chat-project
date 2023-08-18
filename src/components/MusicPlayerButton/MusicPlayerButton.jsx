import { useState } from 'react'
import './MusicPlayerButton.css'
import pauseIcon from '../../assets/pause-button.svg'


function MusicPlayerButton() {

  return (
    <div className="mp-button-container">
     <img src={pauseIcon} className="pause-button" />
    </div>
  )
}

export default MusicPlayerButton
