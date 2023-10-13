'use client';

import Button from '@/components/common/Button';
import UserAvatar from '@/components/common/UserAvatar';
import {
  BotnetIcon,
  ExploreIcon,
  NotificationBellIcon,
  SearchIcon,
} from '@/icons';
import cx from 'classnames';
import { InterTight } from '@/app/fonts';
import { useAppStore } from '@/store/Spaces';
import { DialogEnums } from '@/types/dialog';
import { useBotnetAuth } from '@/store/Auth';
import { ExitIcon } from '@radix-ui/react-icons';
import { useContext } from 'react';
import { AuthStateContext } from '@/store/AuthProvider';
import ProfileMenu from './ProfileMenu';
import './AppNavigation.css';

const AppNavigation = () => {
  const [session, authIsLoading] = useBotnetAuth(state => [
    state.session,
    state.isLoading,
  ]);
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);
  const { signOutUser } = useContext(AuthStateContext);

  const showAccount = () => {
    if (authIsLoading) {
      return;
    }

    setShowDialog(true, DialogEnums.account);
  };

  const onSignOut = () => {
    signOutUser();
  };

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
        {!session && <ProfileMenu />}

        {session && (
          <>
            <Button
              className="flex justify-center items-center"
              onClick={showAccount}
            >
              <UserAvatar />
            </Button>
            <Button className="flex ml-2" onClick={() => onSignOut()}>
              <ExitIcon />
            </Button>
          </>
        )}
      </div>

      <div className="bottom flex-col justify-start items-center">
        {!session && <ProfileMenu />}

        {session && (
          <>
            <Button
              className="flex justify-center items-center"
              onClick={showAccount}
            >
              <UserAvatar />
            </Button>
            <Button className="logout" onClick={() => onSignOut()}>
              <ExitIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppNavigation;
