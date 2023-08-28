import { useState } from 'react';
import './InfoSidebar.css';
import IconText from '../IconText/IconText';
import SubscribeButton from '../SubscribeButton/SubscribeButton';
import Links from '../Links/Links';
import { MusicPlayer } from '@/features';

interface social {
  name: string;
  link: string;
}

interface CampUserInfoProps {
  campName: string;
  campHost: string;
  campHostAvatar: string;
  campMessage: string;
  location: string;
  weather: string;
  socials: social[];
}

const CampUserInfo: CampUserInfoProps = {
  campName: 'Camp Cai',
  campHost: 'Jeremy Cai',
  campHostAvatar: '/assets/camp-avatar.png',
  campMessage:
    "Hi deep work crew! I created this space to focus on our deep work. Comment what you'll be working on.",
  location: 'Park City, USA',
  weather: 'Sunny 82° F',
  socials: [
    { name: 'Substack ↗', link: '' },
    { name: 'Twitter ↗', link: 'https://twitter.com/' },
    { name: 'Instagram ↗', link: 'https://www.instagram.com/' },
    { name: 'YouTube ↗', link: 'https://www.youtube.com/' },
  ],
};

function InfoSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open ? (
        <div className="info-layout">
          <div className="pin-container">
            <img src={'/assets/Pin.svg'} className="pin" alt="Pin Image" />
          </div>
          <div className="main-content">
            <div className="header-container">
              <h1 className="info-header">{CampUserInfo.campName}</h1>

              <div
                className="closebutton-container"
                onClick={() => setOpen(!open)}
              >
                <img
                  src={'/assets/close-button.svg'}
                  className="close-button"
                />
              </div>
            </div>
            <div className="message-container">
              <p className="info-message">{CampUserInfo.campMessage}</p>
              <SubscribeButton />
            </div>
            <div className="host-container">
              <p className="info-label"> Host </p>
              <div className="camp-host">
                <img
                  src={CampUserInfo.campHostAvatar}
                  className="user-avatar"
                  alt="User Avatar"
                />
                <p className="info-host">{CampUserInfo.campHost}</p>
              </div>
            </div>

            <div className="conditions-container">
              <p className="info-label"> Conditions </p>
              <IconText
                src={'/assets/location-pin.svg'}
                text={CampUserInfo.location}
              />
              <IconText
                src={'/assets/weather-icon.svg'}
                text={CampUserInfo.weather}
              />
            </div>

            <div className="links-container">
              <p className="info-label"> Links </p>
              <Links socials={CampUserInfo.socials} />
            </div>
          </div>

          <div className="playlist-container">
            <MusicPlayer />
          </div>
        </div>
      ) : (
        <div
          className="header-container-collapsed"
          onClick={() => setOpen(!open)}
        >
          <div className="info-layout-collapsed">
            <div className="pin-container">
              <img
                src={'/assets/Pin.svg'}
                className="pin-collapsed"
                alt="Pin Image"
              />
            </div>
            <h1 className="info-header-collapsed">{CampUserInfo.campName}</h1>
          </div>
        </div>
      )}
    </>
  );
}

export default InfoSidebar;
