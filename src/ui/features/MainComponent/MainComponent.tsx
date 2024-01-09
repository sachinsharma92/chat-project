'use client';
import { mobileWidthBreakpoint } from '@/constants';
import { useWindowResize } from '@/hooks';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { head } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

import Button from '@/components/common/Button';
import { CloseIcon, ExpandV2Icon } from '@/icons';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import DesktopFooterLink from './DesktopFooterLink';
import './MainComponent.css';

const SpaceContent = dynamic(() => import('../SpaceContent'));
const GameScreen = dynamic(() => import('../GameScreen'));

const MainComponent = () => {
  const refMainComponent = useRef(null);
  const [isFullScreen, setFullScreen] = useState(false);
  const [theme, setTheme] = useState('')

  const { availableWidth } = useWindowResize();
  const [minimizeMed, setMinimizeMed] = useState(true);
  const [minimizeSm, setMinimizeSm] = useState(false);
  const [expandFullScreen] = useState(false);

  const { spaceInfo } = useSelectedSpace();

  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);

  const toggleMinimizeMedGameScreen = () => {
    setMinimizeMed(!minimizeMed);

    if (!minimizeMed) {
      setMinimizeSm(false);
    }
  };

  const fullScreenToggle = () => {
    const screenControl = refMainComponent.current;
    if (screenControl) {
      if (screenControl.requestFullscreen) {
        screenControl.requestFullscreen();
        setFullScreen(true);
      } else if (screenControl.mozRequestFullScreen) {
        screenControl.mozRequestFullScreen();     // Firefox
        setFullScreen(true);
      } else if (screenControl.webkitRequestFullscreen) {
        screenControl.webkitRequestFullScreen();  // Safari
        setFullScreen(true);
      } else if (screenControl.msRequestFullscreen) {
        screenControl.msRequestFullscreen();      // IE/Edge
        setFullScreen(true);
      }
    }

    if (document.fullscreenElement) {
      document.exitFullscreen()
      setFullScreen(false);
    }
  }

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches }) => {
        if (matches) {
          setTheme('dark')
        } else {
          setTheme('')
        }
      })
  }, [])


  return (
    <div className={`main-component ${theme}`} ref={refMainComponent}>
      <div
        className={cx('main-component-content', {
          'fullWidthStyle': minimizeMed,
        })}>

        <div className={cx('space-content-mobile', { 'space-content': minimizeMed })}>
          <SpaceContent isFullScreen={isFullScreen} fullScreenHandler={fullScreenToggle} />
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

          <Button className="btn-desktop-fullscreen-toggle">
            {!isFullScreen ? (
              <ExpandV2Icon className="fill-black dark:fill-white" />
            ) : (
              <CloseIcon className="fill-black dark:fill-white" />
            )}
          </Button>

          <DesktopFooterLink />
        </div>
        <div
          className={cx('space-content-desktop', {
            'space-content-min-sm': minimizeSm,
            'space-content-hide': !minimizeMed,
            'space-content': minimizeMed
          })}
        >
          <SpaceContent isFullScreen={isFullScreen} fullScreenHandler={toggleMinimizeMedGameScreen} />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
