'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, type, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-gray-4 uppercase tracking-wider mb-2 ml-1">
            {label}
          </label>
        )}
        <div
          className={`
            flex items-center gap-3 bg-white rounded-2xl border-2 transition-all duration-200
            ${error ? 'border-red' : 'border-gray-2 focus-within:border-orange'}
            ${icon ? 'px-4' : 'px-4'}
            py-3.5
          `}
        >
          {icon && <span className="text-gray-4 flex-shrink-0">{icon}</span>}
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            className={`flex-1 border-none outline-none text-base text-gray-7 placeholder:text-gray-4 bg-transparent py-1 ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-4 flex-shrink-0"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="text-red text-sm mt-2 ml-1">{error}</p>}
        {hint && !error && <p className="text-gray-4 text-sm mt-2 ml-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
