import { CSSProperties, InputHTMLAttributes, forwardRef } from 'react';
import { isEmpty, isFunction } from 'lodash';
import { cn } from '@/lib/utils';
import './TextInput.css';

type TextInputPropsType = {
  className?: string;
  ariaLabel?: string;
  value?: string | undefined;
  style?: Partial<CSSProperties>;
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  type?: 'password' | 'text' | 'email';
  variant?: 'primary' | undefined;
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
      variant,
      type,
      autoFocus,
      ...props
    }: InputHTMLAttributes<HTMLInputElement> & TextInputPropsType,
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type={type || 'text'}
        aria-label={ariaLabel || 'TextInput'}
        className={cn('text-input', className, {
          'primary-input': variant === 'primary',
        })}
        {...(isFunction(onChange) && { onChange, value })}
        {...(!isEmpty(defaultValue) && { defaultValue })}
        style={{ ...style }}
        {...props}
        autoComplete="off"
        autoCorrect="off"
        autoFocus={autoFocus}
      />
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
