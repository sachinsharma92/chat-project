import React, { useState, useRef, useEffect } from 'react';
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
    <div
      className="space-description-container"
      style={{ display: 'flex', alignItems: 'flex-end' }}
    >
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
  );
};

export default SpaceDescription;
