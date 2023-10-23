'use client';

import { MeatballsIcon } from '@/icons';
import { Inter } from '@/app/fonts';
import { useAppStore } from '@/store/Spaces';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import JoinCampButton from '../JoinCampButton/JoinCampButton';
import Button from '@/components/common/Button';
import SpaceStatistics from './SpaceStatistics';
import Apps from './Apps';
import Avatar from '@/components/common/Avatar/Avatar';
import cx from 'classnames';
import Links from '@/components/common/Links/Links';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useEffect, useMemo } from 'react';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';
import { head, isEmpty } from 'lodash';

import './InfoSidebar.css';
import '@/components/common/styles/Button.css';

interface featureFlagProps {
  subscribeFeature: boolean;
  joinCampFeature: boolean;
  copyLinkFeature: boolean;
}

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
  const { spaceInfo } = useSelectedSpace();
  const { availableWidth } = useWindowResize();

  const showMore = () => {
    // todo
  };

  const spaceName = useMemo(
    () => spaceInfo?.spaceName || spaceInfo?.host?.displayName || 'Botnet',
    [spaceInfo],
  );

  const spaceDescription = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);

    return (
      spaceBotInfo?.description ||
      spaceInfo?.description ||
      'Welcome to Botnet!'
    );
  }, [spaceInfo]);

  /**
   * Expand/shrink space info depending on screen size
   */
  useEffect(() => {
    if (availableWidth < mobileWidthBreakpoint) {
      setExpandInfoSidebar(false);
    } else {
      setExpandInfoSidebar(true);
    }
  }, [availableWidth, setExpandInfoSidebar]);

  return (
    <>
      {expandInfoSidebar && (
        <div className={cx(Inter.className, 'info-layout')}>
          <div className="main-content">
            <div className="header-container">
              <Avatar
                className="header-icon"
                name={spaceName}
                src={spaceInfo?.image}
                height={80}
                width={80}
              />
              <Button
                className="more-button"
                type="button"
                onClick={() => showMore()}
              >
                <DotsHorizontalIcon />
              </Button>
            </div>

            <h1 className="info-header">{spaceInfo?.spaceName || 'Botnet'}</h1>
            <SpaceStatistics />

            <div className="message-container flex-col">
              {featureFlags.joinCampFeature && <JoinCampButton />}
              <p className="info-message">{spaceDescription}</p>
            </div>

            {!isEmpty(spaceInfo?.host) && (
              <div className="info-host">
                <Avatar
                  className="info-host-avatar"
                  height={24}
                  width={24}
                  name={spaceInfo?.host?.displayName}
                  src={spaceInfo?.host?.image}
                />
                <p>
                  {spaceInfo?.host?.displayName}
                  <span>Creator</span>
                </p>
              </div>
            )}

            <div className="apps-container hidden">
              <p className="info-label"> Apps </p>
              <Apps />
            </div>

            {!isEmpty(spaceInfo?.links) && (
              <div className="links-container">
                <p className="info-label"> Links </p>
                <Links socials={spaceInfo?.links || []} />
              </div>
            )}
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
            <Avatar
              className="header-icon header-icon-collapsed"
              name={spaceName}
              src={spaceInfo?.image}
              height={40}
              width={40}
            />

            <Button
              className="header-expand flex justify-center items-center dark-button"
              onClick={() => showMore()}
            >
              <MeatballsIcon />
            </Button>
          </div>

          <h1 className="info-header info-header-collapsed">{spaceName}</h1>
          <SpaceStatistics collapsed />
        </div>
      )}
    </>
  );
};

export default InfoSidebar;
