import { useState } from 'react'
import './CameraButton.css'
import cameraIcon from '../../assets/camera-icon.svg'


function CameraButton() {

  return (
    <div className="camera-button-container">
      <img src={cameraIcon} className="camera-button" />
    </div>
  )
}

export default CameraButton
