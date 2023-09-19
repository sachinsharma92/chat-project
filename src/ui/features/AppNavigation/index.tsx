'use client';

import Button from '@/ui/common/Button';
import UserAvatar from '@/ui/common/UserAvatar';
import {
  BotnetIcon,
  ExploreIcon,
  NotificationBellIcon,
  SearchIcon,
} from '@/icons';
import cx from 'classnames';
import { InterTight } from '@/app/fonts';
import './AppNavigation.css';

const AppNavigation = () => {
  return (
    <div className={cx(InterTight.className, 'app-nav')}>
      <div className="top left flex">
        <Button className="logo flex justify-center">
          <BotnetIcon />
        </Button>
      </div>

      <div className="center flex">
        <Button className="explore flex justify-center">
          <ExploreIcon />
        </Button>

        <Button className="search flex justify-center">
          <SearchIcon />
        </Button>

        <Button className="notification flex justify-center">
          <NotificationBellIcon />
        </Button>
      </div>

      <div className="right flex justify-center">
        <Button className="login flex justify-center items-center">
          <p>Login</p>
        </Button>
        <Button className="sign-in flex justify-center items-center">
          <p>Sign In</p>
        </Button>
      </div>

      <div className="bottom flex-col justify-start items-center">
        <UserAvatar />
      </div>
    </div>
  );
};

export default AppNavigation;
