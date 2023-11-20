'use client';

import {
  ExpandBoxIcon,
  ExpandSmallBoxIcon,
  ExpandV2Icon,
  MinimizeBoxIcon,
  MinimizeMedBoxIcon,
} from '@/icons';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';
import { useState } from 'react';

import cx from 'classnames';
import dynamic from 'next/dynamic';
import AppNavigation from '../AppNavigation';
import Button from '@/components/common/Button';
import GameScreen from '../GameScreen';

import './MainComponent.css';

const SpaceContent = dynamic(() => import('../SpaceContent'), {
  ssr: false,
});

const MainComponent = () => {
  const { availableWidth } = useWindowResize();

  const [minimizeMed, setMinimizeMed] = useState(true);
  const [minimizeSm, setMinimizeSm] = useState(false);

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
      <div className="header-nav">
        <AppNavigation />
      </div>
      <div className="main-component-content">
        <div className="space-content space-content-mobile">
          <SpaceContent />
        </div>

        <div
          className={cx('game-content', {
            'game-content-min-sm': minimizeSm,
            'game-content-max': !minimizeMed,
          })}
        >
          <GameScreen
            hideBotChat={minimizeMed && availableWidth >= mobileWidthBreakpoint}
          />
          <div className="expand-min-options">
            {availableWidth > mobileWidthBreakpoint && (
              <Button onClick={toggleMinimizeSmGameScreen}>
                {!minimizeSm && <MinimizeBoxIcon />}
                {minimizeSm && <ExpandSmallBoxIcon />}
              </Button>
            )}

            {availableWidth > mobileWidthBreakpoint && (
              <Button onClick={toggleMinimizeMedGameScreen}>
                {minimizeMed && <ExpandBoxIcon />}
                {!minimizeMed && <MinimizeMedBoxIcon />}
              </Button>
            )}

            {availableWidth <= mobileWidthBreakpoint && (
              <Button>
                <ExpandV2Icon />
              </Button>
            )}
          </div>
        </div>
        <div
          className={cx('space-content space-content-desktop', {
            'space-content-min-sm': minimizeSm,
            'space-content-hide': !minimizeMed,
          })}
        >
          <SpaceContent />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
