import { head, isEmpty, isString, toString, toUpper } from 'lodash';
import cx from 'classnames';
import * as AvatarRadix from '@radix-ui/react-avatar';
import './Avatar.css';

type AvatarComponentProps = {
  src?: string;
  name?: string;
  ariaLabel?: string;
  className?: string;
  alt?: string;
};

function Avatar(props: AvatarComponentProps) {
  const { alt, src, name, ariaLabel, className } = props;

  return (
    <AvatarRadix.Root
      className={cx('avatar-layout flex justify-center items-center', {
        [`${className}`]: !isEmpty(className) && isString(className),
      })}
      aria-label={!isEmpty(ariaLabel) ? ariaLabel : 'Avatar'}
    >
      <AvatarRadix.Image
        className="avatar-image"
        src={src}
        {...(alt && !isEmpty(alt) && { alt })}
      />
      <AvatarRadix.Fallback className="avatar-fallback" delayMs={600}>
        {toUpper(head(toString(name)))}
      </AvatarRadix.Fallback>
    </AvatarRadix.Root>
  );
}

export default Avatar;
