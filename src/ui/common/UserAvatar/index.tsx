import { isEmpty } from 'lodash';
import Avatar from '../Avatar/Avatar';
import './UserAvatar.css';
import cx from 'classnames';

type UserAvatarProps = {
  className?: string;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { className } = props;

  return (
    <div
      className={cx('user-avatar', { [`${className}`]: !isEmpty(className) })}
    >
      <Avatar src="/assets/avatarImage.svg" />
    </div>
  );
};

export default UserAvatar;
