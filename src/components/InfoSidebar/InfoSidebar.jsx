import { useState } from 'react'
import './InfoSidebar.css'
import pin from '../../assets/Pin.svg'
import weatherIcon from '../../assets/weather-icon.svg'
import locationPin from '../../assets/location-pin.svg'
import userAvatar from '../../assets/camp-avatar.png'
import IconText from '../IconText/IconText'
import closeIcon from '../../assets/close-button.svg'
import SubscribeButton from '../SubscribeButton/SubscribeButton'
import Links from '../Links/Links'
import Playlist from '../Playlist/Playlist'


const CampUserInfo = {
    campName: "Camp Cai",
    campHost: "Jeremy Cai",
    campHostAvatar: userAvatar,
    campMessage: "Hi deep work crew! I created this space to focus on our deep work. Comment what you'll be working on.",
    location: "Park City, USA",
    weather: "Sunny 82° F",
    socials: [
        {name: 'Substack ↗', link: ''},
        {name: 'Twitter ↗', link: 'https://twitter.com/'},
        {name: 'Instagram ↗', link: 'https://www.instagram.com/'},
        {name: 'YouTube ↗', link:'https://www.youtube.com/' }
    ]
};



function InfoSidebar() {
  const [open, setOpen] = useState(true);
  return (
  <>
  {open ? 
    <div className="info-layout">
        <div className="pin-container">
          <img src={pin} className="pin" alt="Pin Image" />
        </div>
    <div className="main-content">
     <div className="header-container">
      <h1 className="info-header">
        {CampUserInfo.campName}
      </h1>
      
      <div className="closebutton-container" onClick={()=> setOpen(!open)}>
        <img src={closeIcon} className="close-button" />
      </div>
     </div>
     <div className="message-container">
        <p className="info-message">
          {CampUserInfo.campMessage}
        </p>
        <SubscribeButton />
     </div>
     <div className="host-container">
        <p className="info-label"> Host </p>
        <div className="camp-host">
          <img src={CampUserInfo.campHostAvatar} className="user-avatar" alt="User Avatar" />
          <p className="info-host">
            {CampUserInfo.campHost}
          </p>
        </div>
     </div>

     <div className="conditions-container">
        <p className="info-label"> Conditions </p>
        <IconText src={locationPin} text={CampUserInfo.location} />
        <IconText src={weatherIcon} text={CampUserInfo.weather} />
     </div>

     <div className="links-container">
        <p className="info-label"> Links </p>
        <Links socials={CampUserInfo.socials} />
     </div>
     </div>


     <div className="playlist-container">
        <Playlist />
     </div>
    </div>
  :  
  <div className="header-container-collapsed" onClick={() => setOpen(!open)}> 
  <div className="info-layout-collapsed">
    <div className="pin-container">
      <img src={pin} className="pin-collapsed" alt="Pin Image" />
    </div>
  <h1 className="info-header-collapsed">
   {CampUserInfo.campName}
  </h1>
  </div>
  </div>}
  
  </>
  )
}

export default InfoSidebar
