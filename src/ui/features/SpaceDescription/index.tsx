'use client';
import { BotnetIcon } from '@/icons';
import { useEffect, useMemo, useRef, useState } from 'react';

import './SpaceDescription.css';
import Avatar from '@/components/common/Avatar/Avatar';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';


type SpaceDescriptionProps = {
  text: string;
};

const SpaceDescription = (props: SpaceDescriptionProps) => {
  const { text } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const { spaceInfo } = useSelectedSpace();
  const botDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );

  useEffect(() => {
    if (textRef?.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      if (scrollHeight > clientHeight) {
        setCanExpand(true);
      }
    }
  }, [text]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const style = {
    maxHeight: isExpanded ? 'none' : '4.5em', // Adjust based on line-height and desired max lines
    overflow: 'hidden',
  };
  return (
    <div className="space-description-container">
      <div className='mt-2 mb-3'>
        <p ref={textRef} style={style} className='text-black dark:text-white text-sm'>
          {text}
        </p>

        {canExpand && (
          <button
            onClick={toggleExpanded}
            className="text-sm"
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        )}
      </div>

      <div className="info-section flex gap-[43px]">
        <div className='info-item flex gap-2 items-start'>
          <div className="t-[2px] relative">
            <Avatar height={22} width={22} src={botDisplayImage} />
          </div>
          <div className='text-black dark:text-white'>
            <h4 className="text-xs font-medium">BOTNET</h4>
            <p className='text-xs font-light'>Creator</p>
          </div>
        </div>

        <div className='text-black dark:text-white'>
          <h4 className="text-xs font-medium uppercase">231.2k</h4>
          <p className='text-xs font-light'>Messages</p>
        </div>

        <div className='text-black dark:text-white'>
          <h4 className="text-xs font-medium uppercase">231.2k</h4>
          <p className='text-xs font-light'>Users</p>
        </div>
      </div>
    </div>
  );
};

export default SpaceDescription;
