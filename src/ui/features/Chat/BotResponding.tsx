import Avatar from '@/ui/common/Avatar/Avatar';
import './BotResponding.css';

const BotResponding = () => {
  return (
    <div className="bot-responding">
      <div className="chat-line-avatar">
        <Avatar src={'/assets/aibotavatar.png'} name={''} />
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
