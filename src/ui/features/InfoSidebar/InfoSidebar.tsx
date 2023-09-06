import { useState } from 'react';
import './InfoSidebar.css';
import Links from '../../common/Links/Links';
import JoinCampButton from '../JoinCampButton/JoinCampButton';

interface social {
  name: string;
  link: string;
}

interface appsProps {
  name: string;
  icon: string;
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

interface featureFlagProps {
  subscribeFeature: boolean;
  joinCampFeature: boolean;
  copyLinkFeature: boolean;
}

const CampUserInfo: CampUserInfoProps = {
  campName: 'Base Camp',
  campHost: 'Jeremy Cai',
  campHostAvatar: '/assets/camp-avatar.png',
  campMessage:
    'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
  location: 'Park City, USA',
  weather: 'Sunny 82° F',
  socials: [
    { name: 'Substack ↗', link: '' },
    { name: 'Twitter ↗', link: 'https://twitter.com/' },
    { name: 'Instagram ↗', link: 'https://www.instagram.com/' },
    { name: 'YouTube ↗', link: 'https://www.youtube.com/' },
  ],
};


const featureFlags: featureFlagProps = {
  subscribeFeature: false,
  joinCampFeature: true,
  copyLinkFeature: true,
};

function InfoSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open ? (
        <div className="info-layout">
          <div className="main-content">
            <div className="header-container">
              <div className="header-icon">
              <img
                  src={'/assets/cover-art.svg'}
                  className="cover-art"
                  alt="Cover Art"
                />
              </div>
              <div
                className="closebutton-container"
                onClick={() => setOpen(!open)}
              >
                <img
                  src={'/assets/close-button.svg'}
                  className="close-button"
                  alt="Close icon"
                />
              </div>
            </div>
            <h1 className="info-header">{CampUserInfo.campName}</h1>
            <div className="message-container">
              {featureFlags.joinCampFeature && <JoinCampButton />}  
              <p className="info-message">{CampUserInfo.campMessage}</p>  
            </div>
        
            <div className="links-container">
              <p className="info-label"> Links </p>
              <Links socials={CampUserInfo.socials} />
            </div>
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