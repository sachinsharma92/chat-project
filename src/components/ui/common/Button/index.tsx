import { isEmpty, isFunction, isString } from 'lodash';
import { CSSProperties, ReactNode, forwardRef } from 'react';
import cx from 'classnames';
import './Button.scss';

export type ButtonProps = CSSProperties & {
  type?: 'button' | 'submit' | 'reset' | undefined;
  isLoading?: boolean;
  isDisabled?: boolean;
  children?: ReactNode;
  text?: string;
  ariaLabel?: string;
  onClick?: <T>(props: T) => any | undefined;
  style?: Partial<CSSProperties>;
  className?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const { className, type, text, children, onClick, ariaLabel, style } =
      props;

    return (
      <button
        ref={ref}
        type={type || 'button'}
        aria-label={ariaLabel}
        style={{
          ...style,
        }}
        onClick={e => {
          if (isFunction(onClick)) {
            onClick(e);
          }
        }}
        className={cx('Button', {
          [`${className}`]: isString(className) && !isEmpty(className),
        })}
      >
        {children || null} {text}
      </button>
    );
  },
);

export default Button;
