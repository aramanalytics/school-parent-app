import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'navy';
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className,
}: KPICardProps) {
  const colorMap = {
    blue: { bg: 'bg-[#DBE4FF]', icon: 'text-[#3B5BDB]' },
    green: { bg: 'bg-[#D3F9D8]', icon: 'text-[#16A36A]' },
    amber: { bg: 'bg-[#FFF3BF]', icon: 'text-[#D97706]' },
    red: { bg: 'bg-[#FFE3E3]', icon: 'text-[#E03131]' },
    navy: { bg: 'bg-[#172554]/10', icon: 'text-[#172554]' },
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-[#172033] tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {trend.value >= 0 ? (
                <div className="flex items-center gap-0.5 text-xs font-semibold text-[#16A36A]">
                  <TrendingUp size={14} />
                  <span>+{trend.value}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-0.5 text-xs font-semibold text-[#E03131]">
                  <TrendingDown size={14} />
                  <span>{trend.value}%</span>
                </div>
              )}
              <span className="text-xs text-[#94A3B8]">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl shrink-0', colorMap[color].bg)}>
          <Icon size={22} className={colorMap[color].icon} />
        </div>
      </div>
    </div>
  );
}

