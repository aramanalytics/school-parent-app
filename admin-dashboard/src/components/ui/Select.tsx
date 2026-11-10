import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-[#172033] uppercase tracking-wider block">
            {label}
            {props.required && <span className="text-[#E03131] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-3.5 py-2 pr-10 rounded-lg border text-sm transition-all outline-none bg-white appearance-none cursor-pointer',
              'focus:ring-2 focus:ring-[#3B5BDB]/20 focus:border-[#3B5BDB]',
              error
                ? 'border-[#E03131] bg-red-50/40 text-[#E03131]'
                : 'border-[#E2E8F0] hover:border-[#94A3B8] text-[#172033]',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[#E03131] font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

