import { isEmpty, isFunction, isString } from 'lodash';
import { CSSProperties, ReactNode, forwardRef } from 'react';
import cx from 'classnames';
import './Button.css';

export type ButtonProps = CSSProperties & {
  type?: 'button' | 'submit' | 'reset' | undefined;
  isLoading?: boolean;
  isDisabled?: boolean;
  children?: ReactNode;
  text?: string;
  ariaLabel?: string;
  onClick?:
    | (<CB extends (...args: any) => any>(
        args?: Parameters<CB>,
      ) => ReturnType<CB>)
    | (() => void);
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
        className={cx(
          {
            [`${className}`]: isString(className) && !isEmpty(className),
          },
          'button',
        )}
      >
        {children || null} {text || null}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
