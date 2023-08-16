import { useState } from 'react'
import './CloseButton.css'
import closeIcon from '../../assets/close-button.svg'


function CloseButton() {

  return (
    <div className="closebutton-container">
     <img src={closeIcon} className="close-button" />
    </div>
  )
}

export default CloseButton
