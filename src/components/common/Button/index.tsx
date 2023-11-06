import { isEmpty, isFunction, isString } from 'lodash';
import { CSSProperties, ReactNode, forwardRef } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import './Button.css';

export type ButtonProps = CSSProperties & {
  type?: 'button' | 'submit' | 'reset' | undefined;
  variant?: 'primary' | undefined;
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
    const {
      variant,
      className,
      type,
      text,
      children,
      onClick,
      ariaLabel,
      style,
      isLoading,
      isDisabled,
    } = props;

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
        className={`${
          isString(className) && !isEmpty(className) ? `${className} ` : ''
        }button${variant === 'primary' ? ' primary-button' : ''}`}
      >
        {children || null} {text || null}
        {isDisabled && <div className="button-disabled"></div>}
        {isLoading && (
          <div className="button-loading">
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="20"
              visible={true}
            />
          </div>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
