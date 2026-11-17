import React, { useState } from 'react';

export interface AVKLogoProps {
  variant?: 'horizontal' | 'vertical' | 'emblem-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  theme?: 'light' | 'dark';
  className?: string;
  showAffiliation?: boolean;
  subTitle?: string;
}

export function AVKLogo({
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  className = '',
  showAffiliation = true,
  subTitle,
}: AVKLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Pixel mappings for the emblem
  const emblemSizes = {
    xs: 'w-7 h-7 min-w-[28px]',
    sm: 'w-9 h-9 min-w-[36px]',
    md: 'w-11 h-11 min-w-[44px]',
    lg: 'w-14 h-14 min-w-[56px]',
    xl: 'w-20 h-20 min-w-[80px]',
    '2xl': 'w-28 h-28 min-w-[112px]',
  };

  // Text sizes corresponding to overall size
  const titleSizes = {
    xs: 'text-xs leading-tight',
    sm: 'text-xs sm:text-sm leading-tight',
    md: 'text-sm sm:text-base leading-snug',
    lg: 'text-base sm:text-lg leading-snug',
    xl: 'text-lg sm:text-xl md:text-2xl leading-tight',
    '2xl': 'text-xl sm:text-2xl md:text-3xl leading-tight',
  };

  const isDark = theme === 'dark';

  const emblem = (
    <div
      className={`relative shrink-0 aspect-square rounded-full flex items-center justify-center select-none shadow-sm transition-transform duration-300 hover:scale-105 ${emblemSizes[size]}`}
    >
      {!imgError ? (
        <img
          src="/avk-logo.svg"
          alt="AVK International Residential Senior Secondary School Emblem"
          className="w-full h-full object-contain aspect-square drop-shadow-sm"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#172554] via-[#1E3A8A] to-[#3B5BDB] flex flex-col items-center justify-center text-white border-2 border-[#F59E0B] shadow-md">
          <span className="font-serif font-black tracking-wider text-[40%] text-[#FDE68A]">AVK</span>
          <span className="text-[20%] font-semibold uppercase tracking-widest text-white/80">CBSE</span>
        </div>
      )}
    </div>
  );

  if (variant === 'emblem-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{emblem}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {emblem}
        <div className="max-w-xl space-y-1">
          <h2
            className={`font-black tracking-tight uppercase ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-[#172554]'
            }`}
          >
            AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
          </h2>
          {showAffiliation && (
            <p
              className={`text-xs sm:text-sm font-semibold tracking-wide ${
                isDark ? 'text-amber-300/90' : 'text-amber-700'
              }`}
            >
              Affiliated to CBSE New-Delhi &bull; Affiliation No: 1930319
            </p>
          )}
          {subTitle && (
            <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              {subTitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 text-left ${className}`}>
      {emblem}
      <div className="min-w-0 flex-1">
        <h2
          className={`font-black tracking-tight uppercase truncate sm:whitespace-normal line-clamp-2 ${titleSizes[size]} ${
            isDark ? 'text-white' : 'text-[#172554]'
          }`}
          title="AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL"
        >
          AVK INTERNATIONAL RESIDENTIAL SENIOR SECONDARY SCHOOL
        </h2>
        {showAffiliation && (
          <p
            className={`text-[10px] sm:text-xs font-semibold tracking-wide truncate ${
              isDark ? 'text-amber-300/90' : 'text-amber-700'
            }`}
          >
            Affiliated to CBSE New-Delhi &bull; Affiliation No: 1930319
          </p>
        )}
        {subTitle && (
          <p className={`text-[10px] sm:text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {subTitle}
          </p>
        )}
      </div>
    </div>
  );
}
