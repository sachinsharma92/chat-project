'use client';


import Button from '@/components/common/Button';
import Popover from '@/components/common/Popover';

import { MoreIcon } from '@/icons';
import { FC } from 'react';
import './BottomDropdown.css';

interface BottomDropdownProps {
  resetHandler?: () => void;
}

const BottomDropdown: FC<BottomDropdownProps> = ({ resetHandler }) => {
  return (
    <Popover
      trigger={
        <Button className="chat-btn">
          <MoreIcon />
        </Button>
      }
      side="top"
      className='bottom-dropdown-popover'
    >
      <div className="bottom-dropdown-menu">
        <ul>
          <li>
            <Button className='p-0' onClick={resetHandler} asChild>
              <p>Reset chat</p>
            </Button>
          </li>
        </ul>
      </div>
    </Popover>
  );
};

export default BottomDropdown;
