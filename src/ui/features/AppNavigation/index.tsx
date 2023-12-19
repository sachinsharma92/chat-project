'use client';

import { BotnetIcon, SearchIcon } from '@/icons';
import { InterTight } from '@/app/fonts';

import cx from 'classnames';
import Button from '@/components/common/Button';
import ProfileMenu from './ProfileMenu';
import TextInput from '@/components/common/TextInput';
import './AppNavigation.css';

const AppNavigation = () => {
  return (
    <div className={cx(InterTight.className, 'app-nav')}>
      <div className="left">
        <Button className="logo flex justify-center">
          <BotnetIcon />
        </Button>
      </div>

      <div className="center">
        <div className="search">
          <Button className="search-icon">
            <SearchIcon />
          </Button>
          <TextInput placeholder="Search" className="search-input" />
        </div>
      </div>

      <div className="right">
        <ProfileMenu />
      </div>
    </div>
  );
};

export default AppNavigation;
