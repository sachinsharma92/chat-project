import { useState } from 'react'
import Avatar from '../Avatar/Avatar'
import InfoSidebar from '../InfoSidebar/InfoSidebar'

function MainComponent() {

  return (
    <div className="main-component">
      <InfoSidebar />
      <Avatar />
    </div>
  )
}

export default MainComponent
