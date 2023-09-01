import { CSSProperties, InputHTMLAttributes, forwardRef } from 'react';
import { isEmpty, isFunction, isString } from 'lodash';
import cx from 'classnames';
import './TextInput.scss';

type TextInputPropsType = {
  className?: string;
  ariaLabel?: string;
  value?: string | undefined;
  style?: Partial<CSSProperties>;
  defaultValue?: string;
  placeholder?: string;
};

const TextInput = forwardRef<HTMLInputElement, TextInputPropsType>(
  (
    {
      className,
      onChange,
      value,
      style,
      ariaLabel,
      defaultValue,
      ...props
    }: InputHTMLAttributes<HTMLInputElement> & TextInputPropsType,
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type="text"
        aria-label={ariaLabel || 'TextInput'}
        className={cx('text-input', {
          [`${className}`]: !isEmpty(className) && isString(className),
        })}
        {...(isFunction(onChange) && { onChange, value })}
        {...(!isEmpty(defaultValue) && { defaultValue })}
        style={{ ...style }}
        {...props}
      />
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
