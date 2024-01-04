import { BotnetIcon } from '@/icons';
import { useEffect, useRef, useState } from 'react';
import './SpaceDescription.css';

type SpaceDescriptionProps = {
  text: string;
};

const SpaceDescription = (props: SpaceDescriptionProps) => {
  const { text } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

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
      <div>
        <p ref={textRef} style={style} className='text-white text-sm my-2'>
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

      <div className="info-section flex gap-9">
        <div className='info-item flex gap-3 items-start'>
          <div className="bg-white min-w-[22px] h-22 min-h-[22px] flex justify-center items-center mt-[2px]">
            <BotnetIcon width={15} />
          </div>
          <div className='text-white'>
            <h4 className="text-xs font-medium">BOTNET</h4>
            <p className='text-xs font-light'>Creator</p>
          </div>
        </div>

        <div className='text-white'>
          <h4 className="text-xs font-medium uppercase">231.2k</h4>
          <p className='text-xs font-light'>Messages</p>
        </div>

        <div className='text-white'>
          <h4 className="text-xs font-medium uppercase">231.2k</h4>
          <p className='text-xs font-light'>Users</p>
        </div>
      </div>
    </div>
  );
};

export default SpaceDescription;
