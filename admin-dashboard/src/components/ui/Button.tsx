import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#3B5BDB] text-white hover:bg-[#2B4AC7] shadow-sm',
    secondary: 'bg-[#F5F7FB] text-[#172033] hover:bg-[#E2E8F0]',
    outline: 'border border-[#E2E8F0] text-[#172033] bg-white hover:bg-[#F5F7FB]',
    ghost: 'text-[#64748B] hover:bg-[#F5F7FB] hover:text-[#172033]',
    danger: 'bg-[#E03131] text-white hover:bg-red-700 shadow-sm',
    success: 'bg-[#16A36A] text-white hover:bg-emerald-700 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-5 py-2.5 text-base font-medium',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

