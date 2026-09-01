import React from 'react';
import type { ServiceCategory } from '../../types/cloud';

interface CategoryBadgeProps {
  category: ServiceCategory;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className = '',
  selected = false,
  onClick
}) => {
  const getCategoryStyles = (cat: ServiceCategory) => {
    switch (cat) {
      case 'Compute':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80';
      case 'Storage':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80';
      case 'Database':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80';
      case 'Networking':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/80';
      case 'Containers':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/80';
      case 'AI / ML':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const selectedStyles = selected
    ? 'ring-2 ring-blue-500 font-bold shadow-xs scale-105'
    : 'opacity-90 hover:opacity-100';

  const isInteractive = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${getCategoryStyles(
        category
      )} ${selectedStyles} ${isInteractive ? 'cursor-pointer' : ''} ${className}`}
    >
      {category}
    </span>
  );
};
