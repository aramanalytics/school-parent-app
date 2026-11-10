import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]',
    success: 'bg-[#D3F9D8] text-[#16A36A] border border-[#B2F2BB]',
    warning: 'bg-[#FFF3BF] text-[#D97706] border border-[#FFE066]',
    error: 'bg-[#FFE3E3] text-[#E03131] border border-[#FFC9C9]',
    info: 'bg-[#DBE4FF] text-[#3B5BDB] border border-[#BAC8FF]',
    purple: 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

