'use client';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ExpandV2Icon, UnionIcon } from '@/icons';
import { useAppStore } from '@/store/App';
import { head } from 'lodash';
import { useMemo } from 'react';

import Button from '@/components/common/Button';
import dynamic from 'next/dynamic';

import CreateAccount from '../CreateAccount';
import SpaceDescription from '../SpaceDescription';
import './SpaceContent.css';

const HomeSpace = dynamic(() => import('./HomeSpace'), { ssr: false });

const SpaceContent = () => {
  const { spaceInfo } = useSelectedSpace();

  const [spaceContentTab, setSpaceContentTab] = useAppStore(state => [
    state.spaceContentTab,
    state.setSpaceContentTab,
  ]);

  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);

  const spaceName = useMemo(
    () => spaceInfo?.host?.displayName || spaceInfo?.spaceName || 'Botnet',
    [spaceInfo],
  );

  const spaceDescription = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);

    return (
      spaceBotInfo?.description ||
      spaceInfo?.description ||
      'Welcome to Botnet!'
    );
  }, [spaceInfo]);

  return (
    <div className="space-content-container">
      <div className="space-content-header p-4">
        <div className='flex gap-1 w-full'>
          <div className="space-content-header-right flex justify-between items-center bg-black w-full pr-2 pl-[2px]">
            <div className='space-content-header-main'>
              <div className="w-8 h-8 overflow-hidden">
                <img
                  src={spaceBotInfo?.background || '/assets/botnet-avatar-bg.jpg'}
                  alt="Background preview"
                />
              </div>
              <div>
                <p className="space-name">{spaceName}</p>
                <p className="text-xs text-white">20.1k Followers</p>
              </div>
            </div>
            <Button className="subscribe">Follow</Button>
          </div>
          <div className='flex gap-1'>
            <div className='share-button-style'>
              <Button>
                <UnionIcon />
              </Button>
            </div>

            <div className="expand-min-options">
              <Button>
                <ExpandV2Icon />
              </Button>
            </div>
          </div>
        </div>

        <div className='info-card bg-black p-2 w-full'>
          <div className='flex justify-between'>
            <h4 className="text-xs uppercase text-white">About</h4>
            <Button className="text-xs text-white p-0">
              Close
            </Button>
          </div>
          <SpaceDescription text={spaceDescription} />
        </div>

        <div className='bg-black h-[22px] flex justify-center items-center text-xs w-full'>
          <Button className='text-white uppercase'>
            Gift
          </Button>
        </div>
      </div>

      <CreateAccount />

      <HomeSpace />

    </div>
  );
};

export default SpaceContent;
