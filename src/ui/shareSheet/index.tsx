import Button from '@/components/common/Button';
import Link from 'next/link';

import { FC } from 'react';
import './shareSheet.css';
import { DiscordIcon, FacebookIcon, RedditIcon, TelegramIcon, XIcon } from '@/icons';

interface ShareSheetProps {
  closeHandler?: () => void;
  overlayHandler?: () => void;
}

const ShareSheet: FC<ShareSheetProps> = ({ closeHandler, overlayHandler }) => {
  const shareList = [
    {
      icon: <DiscordIcon />,
      linkUrl: '',
      link: 'Share to discord',
    },
    {
      icon: <RedditIcon />,
      linkUrl: '',
      link: 'Share to reddit',
    },
    {
      icon: <XIcon />,
      linkUrl: '',
      link: 'Share to x',
    },
    {
      icon: <FacebookIcon />,
      linkUrl: '',
      link: 'Share to facebook',
    },
    {
      className: 'telegram-icon',
      icon: <TelegramIcon />,
      linkUrl: '',
      link: 'Share to telegram',
    },
    {
      linkUrl: '',
      link: 'Copy link',
    },
    {
      linkUrl: '',
      link: 'Share via email',
    }

  ]
  return (
    <>
      <div className='share-sheet bg-white dark:bg-black p-4 w-full'>
        <div className='flex justify-between'>
          <h4 className="text-xs uppercase text-black dark:text-white">Share to</h4>
          <Button className="text-xs text-black dark:text-white p-0" onClick={closeHandler}>
            Close
          </Button>
        </div>
        <ul className="flex flex-col gap-1 mt-4">
          {shareList.map((item, index) => (
            <li key={index}>
              <Link className={`share-btn gap-2 ${item.className}`} href={item.linkUrl}>
                <div>{item.icon}</div>
                <span> {item.link}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Button className="text-xs text-black dark:text-white underline mt-4" onClick={closeHandler}>
          Cancel
        </Button>
      </div>

      <div className='create-popup' onClick={overlayHandler} />
    </>
  );
};

export default ShareSheet;
