'use client';
import Button from '@/components/common/Button';
import Popover from '@/components/common/Popover';

import { MoreIcon } from '@/icons';
import { FC, useState } from 'react';
import './BottomDropdown.css';

interface BottomDropdownProps {
  resetHandler?: () => void;
  hideChatHandler?: () => void;
}

const BottomDropdown: FC<BottomDropdownProps> = ({ resetHandler, hideChatHandler }) => {
  const [popoverToggle, setPopoverToggle] = useState(false);

  const resetHandlerFnc = () => {
    setPopoverToggle(false)
    resetHandler();
  }

  return (
    <Popover
      trigger={
        <Button className="chat-btn">
          <MoreIcon />
        </Button>
      }
      side="top"
      className='bottom-dropdown-popover'
      isOpen={popoverToggle}
      setPopoverToggle={setPopoverToggle}
    >
      <div className="bottom-dropdown-menu">
        <ul>
          <li>
            <Button className='p-0' onClick={resetHandlerFnc}>
              <p>Reset chat</p>
            </Button>
          </li>
          <li>
            <Button className='p-0' onClick={hideChatHandler}>
              <p>Hide chat</p>
            </Button>
          </li>
        </ul>
      </div>
    </Popover>
  );
};

export default BottomDropdown;
