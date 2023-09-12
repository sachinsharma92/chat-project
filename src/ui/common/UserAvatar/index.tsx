import { isEmpty } from 'lodash';
import Avatar from '../Avatar/Avatar';
import cx from 'classnames';
import './UserAvatar.css';

type UserAvatarProps = {
  className?: string;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { className } = props;

  return (
    <div
      className={cx('user-avatar flex justify-center items-center', {
        [`${className}`]: !isEmpty(className),
      })}
    >
      <Avatar src="/assets/camp-avatar.png" />
    </div>
  );
};

export default UserAvatar;
