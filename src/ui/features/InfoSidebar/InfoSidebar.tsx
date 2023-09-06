import { useState } from 'react';
import './InfoSidebar.css';
import IconText from '../../common/IconText/IconText';
import SubscribeButton from '../SubscribeButton/SubscribeButton';
import Links from '../../common/Links/Links';
import MusicPlayer from '../MusicPlayer';
import AppsList from '../AppsList/AppsList';
import MembersList from '../MembersList/MembersList';
import JoinCampButton from '../JoinCampButton/JoinCampButton';
import CopyLinkButton from '../CopyLinkButton/CopyLinkButton';

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
  campName: 'Camp Cai',
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

const apps: appsProps[] = [
  { name: 'Bulletin', icon: '/assets/bulletin-icon.svg' },
  { name: 'Store', icon: '/assets/store-icon.svg' },
  { name: 'Chat', icon: '/assets/chat-icon.svg' },
];

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
                  alt="Close icon"
                />
              </div>
            </div>
            <div className="message-container">
              <p className="info-message">{CampUserInfo.campMessage}</p>
              <MembersList onlineMembers={2} memberCount={23} />
              {featureFlags.subscribeFeature && <SubscribeButton />}
              {featureFlags.joinCampFeature && <JoinCampButton />}
              {featureFlags.copyLinkFeature && <CopyLinkButton />}
            </div>
            <div className="host-container">
              <p className="info-label"> Host </p>
              <div className="camp-host">
                <img
                  src={CampUserInfo.campHostAvatar}
                  className="info-user-avatar"
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

            <AppsList appsList={apps} />

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
