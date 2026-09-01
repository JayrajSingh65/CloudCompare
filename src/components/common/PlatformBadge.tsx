import React from 'react';
import type { Platform } from '../../types/cloud';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  size = 'md',
  className = ''
}) => {
  const isAzure = platform === 'azure';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2'
  };

  const styleClasses = isAzure
    ? 'bg-[#0078D4]/10 text-[#0078D4] border-[#0078D4]/30 dark:bg-[#0078D4]/20 dark:text-[#38a6ff]'
    : 'bg-[#FF9900]/10 text-[#D97706] dark:text-[#FF9900] border-[#FF9900]/30 dark:bg-[#FF9900]/20';

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide rounded-md border uppercase font-mono ${sizeClasses[size]} ${styleClasses} ${className}`}
    >
      <span
        className={`rounded-full ${isAzure ? 'bg-[#0078D4]' : 'bg-[#FF9900]'} ${
          size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'
        }`}
      />
      {isAzure ? 'Azure' : 'AWS'}
    </span>
  );
};
