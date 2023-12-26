'use client';

import { useAppStore } from '@/store/App';
import { PersonIcon } from '@radix-ui/react-icons';
import { isEmpty, isFunction } from 'lodash';
import { useRouter } from 'next/navigation';
import { useBotnetAuth } from '@/store/Auth';
import { useContext, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AuthStateContext, defaultSpaceId } from '@/store/AuthProvider';

import Button from '@/components/common/Button';
import Popover from '@/components/common/Popover';
import UserAvatar from '@/components/common/UserAvatar';

import './ProfileMenu.css';
import { ChatBotStateContext } from '@/store/ChatBotProvider';

const ProfileMenu = () => {
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);
  const router = useRouter();
  const [session, authIsLoading] = useBotnetAuth(state => [
    state.session,
    state.isLoading,
  ]);

  const { leaveChatRoom } = useContext(ChatBotStateContext);

  const { signOutUser } = useContext(AuthStateContext);

  /**
   * Navigate to auth page on click
   */
  const showSignInDialog = () => {
    if (isFunction(setShowDialog)) {
      router.push('/auth');
    }
  };

  const showAccount = () => {
    if (authIsLoading) {
      return;
    }

    router.push('/settings');
  };

  const isLoggedIn = useMemo(
    () => Boolean(session && !isEmpty(session)),
    [session],
  );

  const logoutAccount = async () => {
    if (isFunction(signOutUser)) {
      await signOutUser();
      // join a new channel on each new session
      await leaveChatRoom();

      router.push(`/?space=${defaultSpaceId}`);
    }
  };

  return (
    <Popover
      trigger={
        <Button
          isLoading={authIsLoading}
          className={cn(isLoggedIn ? 'user-account' : 'sign-in')}
        >
          {!isLoggedIn && <PersonIcon height={16} width={16} />}
          {isLoggedIn && <UserAvatar />}
        </Button>
      }
      side="bottom"
    >
      <div className="profile-menu">
        <ul>
          {!isLoggedIn && (
            <li>
              <Button onClick={showSignInDialog}>
                <p>Sign up / Log in</p>
              </Button>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Button onClick={showAccount}>
                  <p>Account</p>
                </Button>
              </li>
              <li>
                <Button onClick={logoutAccount}>
                  <p>Log out</p>
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </Popover>
  );
};

export default ProfileMenu;
