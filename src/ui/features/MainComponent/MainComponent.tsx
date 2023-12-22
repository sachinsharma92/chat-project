'use client';

import { mobileWidthBreakpoint } from '@/constants';
import { useWindowResize } from '@/hooks';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import {
  CloseIcon,
  ExpandBoxIcon,
  ExpandV2Icon,
  Volume2Icon
} from '@/icons';
import { head } from 'lodash';
import { useMemo, useState } from 'react';

import Button from '@/components/common/Button';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import AppNavigation from '../AppNavigation';
import './MainComponent.css';

const SpaceContent = dynamic(() => import('../SpaceContent'));
const GameScreen = dynamic(() => import('../GameScreen'));

const MainComponent = () => {
  const { availableWidth } = useWindowResize();

  const [minimizeMed, setMinimizeMed] = useState(true);
  const [minimizeSm, setMinimizeSm] = useState(false);
  const [expandFullScreen, setExpandFullScreen] = useState(false);

  const { spaceInfo } = useSelectedSpace();

  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);

  const toggleMinimizeMedGameScreen = () => {
    setMinimizeMed(!minimizeMed);

    if (!minimizeMed) {
      setMinimizeSm(false);
    }
  };

  const toggleMinimizeSmGameScreen = () => {
    setMinimizeSm(!minimizeSm);

    if (!minimizeSm) {
      setMinimizeMed(true);
    }
  };

  return (
    <div className="main-component">
      <div className={cx('header-nav', { 'space-content-hide': !minimizeMed })}>
        <AppNavigation />
      </div>
      <div
        className={cx('main-component-content', {
          'fullWidthStyle': minimizeMed,
        })}>
        <div className={cx('space-content-mobile', { 'space-content': minimizeMed })}>
          <SpaceContent />
        </div>

        <div
          className={cx('game-content', {
            'game-content-min-sm': minimizeSm,
            'game-content-max': !minimizeMed,
            'game-content-expand-screen': expandFullScreen,
            'card-game-content': minimizeMed,
          })}
        >
          <div className="game-content-background">
            <img
              src={spaceBotInfo?.background || '/assets/botnet-avatar-bg.jpg'}
              alt="Background preview"
            />
          </div>
          <GameScreen
            hideBotChat={minimizeMed && availableWidth >= mobileWidthBreakpoint}
          />


          <div className='flex w-full'>
            <div className="volume-button-style">
              <Button>
                <Volume2Icon />
              </Button>
            </div>

            <div className="expand-min-options">
              {availableWidth > mobileWidthBreakpoint && (
                <Button onClick={toggleMinimizeMedGameScreen}>
                  {minimizeMed && <ExpandBoxIcon />}
                  {!minimizeMed && <CloseIcon />}
                </Button>
              )}

              {availableWidth <= mobileWidthBreakpoint && (
                <Button
                  onClick={() => {
                    setExpandFullScreen(!expandFullScreen);
                  }}
                >
                  <ExpandV2Icon />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div
          className={cx('space-content-desktop', {
            'space-content-min-sm': minimizeSm,
            'space-content-hide': !minimizeMed,
            'space-content': minimizeMed
          })}
        >
          <SpaceContent />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
