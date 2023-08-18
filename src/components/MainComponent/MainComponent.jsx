import React from 'react'

import InfoSidebar from '../InfoSidebar/InfoSidebar'
import Avatar from '../Avatar/Avatar'
import './MainComponent.css'
import CameraButton from '../CameraButton/CameraButton'
import MessageBox from '../MessageBox/MessageBox'

function MainComponent() {

  return (
    <>
    <div className="main-component">
      <InfoSidebar />
      <div className="right-sidebar">
        <Avatar />
        <CameraButton />
      </div>
    </div>
    <div className="footer">
        <MessageBox />
    </div>
    </>
  )
}

export default MainComponent
