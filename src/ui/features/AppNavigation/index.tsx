'use client';

import { atlasGrotesk } from '@/app/fonts';

import Avatar from '@/components/common/Avatar/Avatar';
import Button from '@/components/common/Button';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import cx from 'classnames';
import { useMemo } from 'react';
import './AppNavigation.css';

const AppNavigation = ({ setTheme }) => {
  const { spaceInfo } = useSelectedSpace();
  const botDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );

  return (
    <div className={cx(atlasGrotesk.className, ' justify-between items-center w-full px-6 h-[52px] hidden sm:flex')}>
      <div className="greetings-bot-avatar bot-image-style">
        <Avatar src={botDisplayImage} />
      </div>

      <nav className="flex items-center gap-4">
        <div className='flex items-center text-xs gap-1'>
          <Button onClick={()=>setTheme('')} className='uppercase p-0 text-black hover:opacity-60'>Light</Button>
          /
          <Button onClick={()=>setTheme('dark')} className='uppercase p-0 text-black hover:opacity-60'>Dark</Button>
        </div>
        <Button className='uppercase text-xs p-0 hover:opacity-60'>login</Button>
      </nav>

      {/* <div className="right">
        <ProfileMenu />
      </div> */}
    </div>
  );
};

export default AppNavigation;
