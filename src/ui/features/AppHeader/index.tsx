'use client';

import Button from '@/ui/common/Button';
import {
  BotnetIcon,
  ExploreIcon,
  NotificationBellIcon,
  SearchIcon,
} from '@/icons';
import './AppHeader.css';

const AppHeader = () => {
  return (
    <div className="app-header">
      <div className="left flex">
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
    </div>
  );
};

export default AppHeader;
