import React from 'react'

import InfoSidebar from '../InfoSidebar/InfoSidebar'
import Avatar from '../Avatar/Avatar'
import './MainComponent.css'
import CameraButton from '../CameraButton/CameraButton'

function MainComponent() {

  return (
    <div className="main-component">
      <InfoSidebar />
      <div className="right-sidebar">
        <Avatar />
        <CameraButton />
      </div>
    </div>
  )
}

export default MainComponent
