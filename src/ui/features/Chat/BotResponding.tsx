import Avatar from '@/components/common/Avatar/Avatar';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useMemo } from 'react';
import './BotResponding.css';

const BotResponding = () => {
  const { spaceInfo } = useSelectedSpace();
  const assistantDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );

  return (
    <div className="bot-responding">
      <div className="chat-line-avatar">
        <Avatar src={assistantDisplayImage} name={''} />
      </div>
      <div className="bubble">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default BotResponding;
