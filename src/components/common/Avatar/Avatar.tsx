import { head, isEmpty, isNumber, isString, toString, toUpper } from 'lodash';
import cx from 'classnames';
import * as AvatarRadix from '@radix-ui/react-avatar';
import './Avatar.css';

type AvatarComponentProps = {
  src?: string;
  name?: string;
  ariaLabel?: string;
  className?: string;
  alt?: string;
  height?: number;
  width?: number;
};

function Avatar(props: AvatarComponentProps) {
  const { alt, src, name, ariaLabel, className, height, width } = props;

  return (
    <AvatarRadix.Root
      className={cx('avatar-layout flex justify-center items-center', {
        [`${className}`]: !isEmpty(className) && isString(className),
      })}
      aria-label={!isEmpty(ariaLabel) ? ariaLabel : 'Avatar'}
      {...(isNumber(height) &&
        height > 0 &&
        isNumber(width) &&
        width > 0 && { style: { height: `${height}px`, width: `${width}px` } })}
    >
      <AvatarRadix.Image
        className="avatar-image"
        src={src}
        {...(alt && !isEmpty(alt) && { alt })}
      />
      <AvatarRadix.Fallback className="avatar-fallback" delayMs={400}>
        {toUpper(head(toString(name)))}
      </AvatarRadix.Fallback>
    </AvatarRadix.Root>
  );
}

export default Avatar;
