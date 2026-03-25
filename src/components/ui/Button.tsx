'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'red' | 'green';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'lg',
      isLoading = false,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none';

    const variants = {
      primary:
        'bg-gradient-to-br from-orange to-orange-2 text-white shadow-lg shadow-orange/30 hover:shadow-orange/40',
      secondary: 'bg-gray-2 text-gray-7',
      ghost: 'bg-transparent text-blue',
      red: 'bg-red-pale text-red',
      green: 'bg-green text-white',
    };

    const sizes = {
      sm: 'px-4 py-2.5 text-sm rounded-xl',
      md: 'px-5 py-3.5 text-base rounded-xl',
      lg: 'px-6 py-4 text-base rounded-2xl',
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
