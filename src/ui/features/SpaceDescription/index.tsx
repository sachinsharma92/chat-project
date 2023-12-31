import React, { useState, useRef, useEffect, useMemo } from 'react';
import './SpaceDescription.css';
import Button from '@/components/common/Button';
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

  const botDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );

  return (
    <div className="space-description-container">
      <div>
        <p ref={textRef} style={style}>
          {text}
        </p>

        {canExpand && (
          <button
            onClick={toggleExpanded}
            style={{ marginLeft: '10px' }}
            className="space-description-container-show-more"
          >
            {isExpanded ? 'less' : 'more'}
          </button>
        )}
      </div>

      <div className='flex gap-3 mt-4'>
        <Button className='tag-style'>Female</Button>
        <Button className='tag-style'>Anime</Button>
        <Button className='tag-style'>Hero</Button>
      </div>

      <div className="info-section">
        <div className='info-item flex gap-3 items-center'>
          <Avatar height={40} width={40} src={botDisplayImage} />
          <div>
            <h4>Created by</h4>
            <p>Shin-Chan</p>
          </div>
        </div>
        <div className='info-item'>
          <h4>Messages</h4>
          <p>241k</p>
        </div>
        <div className='info-item hidden md:block'>
          <h4>Users</h4>
          <p>2.1k</p>
        </div>
      </div>
    </div>
  );
};

export default SpaceDescription;
