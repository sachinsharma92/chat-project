import { isEmpty } from 'lodash';
import Avatar from '../Avatar/Avatar';
import cx from 'classnames';
import { useBotnetAuth } from '@/store/Auth';
import './UserAvatar.css';

type UserAvatarProps = {
  className?: string;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { className } = props;
  const [image, displayName] = useBotnetAuth(state => [
    state.image,
    state.displayName,
  ]);

  return (
    <div
      className={cx('user-avatar flex justify-center items-center', {
        [`${className}`]: !isEmpty(className),
      })}
    >
      <Avatar src={image} name={displayName} />
    </div>
  );
};

export default UserAvatar;
