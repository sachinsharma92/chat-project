import { useState } from 'react'
import './InfoSidebar.css'
import pin from '../../assets/Pin.png'
import weatherIcon from '../../assets/weather-icon.svg'
import locationPin from '../../assets/location-pin.svg'
import IconText from '../IconText/IconText'
import CloseButton from '../CloseButton/CloseButton'

const CampUserInfo = {
    campName: "Camp Cai",
    campHost: "Jeremy Cai",
    campMessage: "Hi deep work crew! I created this space to focus on our deep work. Comment what you'll be working on.",
    location: "Park City, USA",
    weather: "Sunny 82 F",
    socials: [
        {name: 'Substack', link: ''},
        {name: 'Twitter', link: 'https://twitter.com/'},
        {name: 'Instagram', link: 'https://www.instagram.com/'},
        {name: 'YouTube', link:'https://www.youtube.com/' }
    ]
};


function InfoSidebar() {

  return (
    <div className="info-layout">
        <div className="pin-container">
          <img src={pin} className="pin" alt="Pin Image" />
        </div>
     <div className="header-container">
      <h1 className="info-header">
        {CampUserInfo.campName}
      </h1>
      <CloseButton />
     </div>
     <div className="message-container">
        <p className="info-message">
          {CampUserInfo.campMessage}
        </p>
     </div>
     <div className="host-container">
        <p className="info-label"> Host </p>
        <p className="info-host">
          {CampUserInfo.campHost}
        </p>
     </div>

     <div className="conditions-container">
        <p className="info-label"> Conditions </p>
        <IconText src={locationPin} text={CampUserInfo.location} />
        <IconText src={weatherIcon} text={CampUserInfo.weather} />
     </div>
    </div>
  )
}

export default InfoSidebar
