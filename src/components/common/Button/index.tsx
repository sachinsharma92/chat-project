'use client';

import './Button.css';

import React, { forwardRef } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { cn } from '@/lib/utils';

interface VariantProps {
  variant?: 'primary' | string;
  text?: string;
  ariaLabel?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      className,
      type,
      text,
      children,
      ariaLabel,
      isLoading,
      isDisabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type || 'button'}
      aria-label={ariaLabel}
      className={cn(
        className,
        'relative flex items-center justify-center p-[4px] overflow-hidden outline-none',
        `${variant === 'primary' ? ' primary-button' : ''}`,
      )}
      {...props}
    >
      {children || null} {text || null}
      {isDisabled && <div className="is-disabled"></div>}
      {isLoading && (
        <div className="is-loading">
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
  ),
);

Button.displayName = 'Button';

export default Button;
