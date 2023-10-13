'use client';

import { MeatballsIcon } from '@/icons';
import { Inter } from '@/app/fonts';
import { useAppStore } from '@/store/Spaces';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Links, { SocialLink } from '../../../components/common/Links/Links';
import JoinCampButton from '../JoinCampButton/JoinCampButton';
import Button from '@/components/common/Button';
import SpaceStatistics from './SpaceStatistics';
import Apps from './Apps';
import UserAvatar from '@/components/common/UserAvatar';
import cx from 'classnames';
import './InfoSidebar.css';
import '../../../components/common/styles/Button.css';

interface CampUserInfoProps {
  campName: string;
  campHost: string;
  campHostAvatar: string;
  campMessage: string;
  location: string;
  weather: string;
  socials: SocialLink[];
}

interface featureFlagProps {
  subscribeFeature: boolean;
  joinCampFeature: boolean;
  copyLinkFeature: boolean;
}

const CampUserInfo: CampUserInfoProps = {
  campName: 'Botnet',
  campHost: 'Jeremy Cai',
  campHostAvatar: '/assets/camp-avatar.png',
  campMessage:
    'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
  location: 'Park City, USA',
  weather: 'Sunny 82° F',
  socials: [
    { name: 'Twitter', link: 'https://twitter.com/' },
    { name: 'Instagram', link: 'https://www.instagram.com/' },
    { name: 'YouTube', link: 'https://www.youtube.com/' },
  ],
};

const featureFlags: featureFlagProps = {
  subscribeFeature: false,
  joinCampFeature: false,
  copyLinkFeature: true,
};

const InfoSidebar = () => {
  const [expandInfoSidebar, setExpandInfoSidebar] = useAppStore(state => [
    state.expandInfoSidebar,
    state.setExpandInfoSidebar,
  ]);

  const showMore = () => {};

  return (
    <>
      {expandInfoSidebar && (
        <div className={cx(Inter.className, 'info-layout')}>
          <div className="main-content">
            <div className="header-container">
              <div className="header-icon"></div>
              <Button
                className="more-button"
                type="button"
                onClick={() => showMore()}
              >
                <DotsHorizontalIcon />
              </Button>
            </div>
            <h1 className="info-header">{CampUserInfo.campName}</h1>
            <SpaceStatistics />

            <div className="message-container flex-col">
              {featureFlags.joinCampFeature && <JoinCampButton />}
              <p className="info-message">{CampUserInfo.campMessage}</p>
            </div>

            <div className="info-host flex justify-start items-center hidden">
              <UserAvatar />
              <p>
                {CampUserInfo.campHost}
                <span>Host</span>
              </p>
            </div>

            <div className="apps-container hidden">
              <p className="info-label"> Apps </p>
              <Apps />
            </div>

            <div className="links-container">
              <p className="info-label"> Links </p>
              <Links socials={CampUserInfo.socials} />
            </div>
          </div>
        </div>
      )}

      {!expandInfoSidebar && (
        <div
          className={cx(
            Inter.className,
            'info-layout-collapsed flex-col items-start justify-start',
          )}
        >
          <div className="header-container">
            <div className="header-icon header-icon-collapsed"></div>
            <Button
              className="header-expand flex justify-center items-center dark-button"
              onClick={() => setExpandInfoSidebar(!expandInfoSidebar)}
            >
              <MeatballsIcon />
            </Button>
          </div>

          <h1 className="info-header info-header-collapsed">
            {CampUserInfo.campName}
          </h1>
          <SpaceStatistics collapsed />
          <div className="cta-collapsed flex justify-start items-center hidden">
            <Button className="join-button flex justify-center items-center">
              Join Space
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoSidebar;
