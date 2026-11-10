import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block">
            {label}
            {props.required && <span className="text-[#E03131] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2 rounded-lg border text-sm transition-all outline-none bg-white',
            'placeholder:text-[#94A3B8]',
            'focus:ring-2 focus:ring-[#3B5BDB]/20 focus:border-[#3B5BDB]',
            error
              ? 'border-[#E03131] bg-red-50/40 text-[#E03131]'
              : 'border-[#E2E8F0] hover:border-[#94A3B8] text-[#172033]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#E03131] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#64748B]">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

