'use client';

import { InterTight } from '@/app/fonts';
import { BotnetIcon, CommentIcon, HomeOutlineIcon, NotificationBellIcon, SearchIcon } from '@/icons';

import Button from '@/components/common/Button';
import cx from 'classnames';
import ProfileMenu from './ProfileMenu';
// import TextInput from '@/components/common/TextInput';
import { PlusIcon } from 'lucide-react';
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
        <Button className="search-icon">
          <HomeOutlineIcon />
        </Button>
        <Button className="search-icon">
          <SearchIcon />
        </Button>
        <Button className="search-icon">
          <CommentIcon />
        </Button>
        <Button className="search-icon">
          <NotificationBellIcon />
        </Button>
        {/* <TextInput placeholder="Search" className="search-input" /> */}
      </div>

      <div className="right">
        <Button className="add-icon">
          <PlusIcon size={18} />
        </Button>
        <ProfileMenu />
      </div>
    </div>
  );
};

export default AppNavigation;
