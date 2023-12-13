'use client';

import cx from 'classnames';
import Button from '@/components/common/Button';
import UserAvatar from '@/components/common/UserAvatar';
import { BotnetIcon, SearchIcon } from '@/icons';
import { InterTight } from '@/app/fonts';
import { useBotnetAuth } from '@/store/Auth';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

import ProfileMenu from './ProfileMenu';
import TextInput from '@/components/common/TextInput';
import './AppNavigation.css';

const AppNavigation = () => {
  const [session, authIsLoading] = useBotnetAuth(state => [
    state.session,
    state.isLoading,
  ]);

  const router = useRouter();

  const showAccount = () => {
    if (authIsLoading) {
      return;
    }

    router.push('/settings');
  };

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
        {!session && <ProfileMenu />}
        {session && (
          <>
            <Button className="add-bot">
              <PlusIcon height={'18px'} width={'18px'} />
            </Button>
            <Button className="user-account" onClick={showAccount}>
              <UserAvatar />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppNavigation;
