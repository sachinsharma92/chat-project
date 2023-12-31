'use client';

import { InterTight } from '@/app/fonts';
import { BotnetIcon, CommentIcon, HomeOutlineIcon, NotificationBellIcon, SearchIcon } from '@/icons';

import Button from '@/components/common/Button';
import cx from 'classnames';
import './AppNavigation.css';
import ProfileMenu from './ProfileMenu';
import { PlusIcon } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

const AppNavigation = () => {
  return (
    <div className={cx(InterTight.className, 'app-nav')}>
      <div className="left">
        <Button className="logo flex justify-center">
          <BotnetIcon />
        </Button>

        <div className="center">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button className="search-icon">
                  <HomeOutlineIcon />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5} side="right">
                  Home
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button className="search-icon">
                  <SearchIcon />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5} side="right">
                  Home
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button className="search-icon">
                  <CommentIcon />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5} side="right">
                  Explore
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button className="search-icon">
                  <NotificationBellIcon />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="TooltipContent" sideOffset={5} side="right">
                  Notifications
                  <Tooltip.Arrow className="TooltipArrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      <div className="right">
        <Button className="add-icon">
          <PlusIcon size={18} />
        </Button>
        <ProfileMenu />
      </div>
    </div >
  );
};

export default AppNavigation;
