import { head, isEmpty, isString, toString } from 'lodash';
import cx from 'classnames';
import './Avatar.css';

type AvatarComponentProps = {
  src?: string;
  name?: string;
  ariaLabel?: string;
  className?: string;
};

function Avatar(props: AvatarComponentProps) {
  const { src, name, ariaLabel, className } = props;

  return (
    <div
      className={cx('avatar-layout flex justify-center items-center', {
        [`${className}`]: !isEmpty(className) && isString(className),
      })}
      aria-label={!isEmpty(ariaLabel) ? ariaLabel : 'Avatar'}
    >
      {!isEmpty(src) && (
        <img src={src} className="avatar-image flex" alt="Avatar Image" />
      )}

      {!src && <p className="flex justify-center">{head(toString(name))}</p>}
    </div>
  );
}

export default Avatar;
