import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ComparisonPair, ServiceEntry } from '../../types/cloud';
import { CategoryBadge } from '../common/CategoryBadge';
import { PlatformBadge } from '../common/PlatformBadge';
import { ArrowRight, Columns2, Sparkles } from 'lucide-react';

interface ComparisonCardProps {
  pair: ComparisonPair;
  azureService?: ServiceEntry;
  awsService?: ServiceEntry;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  pair,
  azureService,
  awsService
}) => {
  const navigate = useNavigate();

  if (!azureService || !awsService) return null;

  const handleInspect = () => {
    navigate(`/compare?azure=${azureService.id}&aws=${awsService.id}`);
  };

  return (
    <div
      onClick={handleInspect}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Card Top Category & Featured Tag */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <CategoryBadge category={pair.category} />
          {pair.featured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800/80 font-mono">
              <Sparkles className="w-3 h-3" /> Featured Pair
            </span>
          )}
        </div>

        {/* Side by Side Titles Header */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <PlatformBadge platform="azure" size="sm" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#0078D4] transition-colors leading-tight">
              {azureService.serviceName}
            </h3>
          </div>

          <div className="space-y-1">
            <PlatformBadge platform="aws" size="sm" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#FF9900] transition-colors leading-tight">
              {awsService.serviceName}
            </h3>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {pair.summaryOfDifferences}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 font-mono text-slate-400 text-[11px]">
          <Columns2 className="w-3.5 h-3.5 text-blue-500" /> Aligned Config Matrix
        </span>

        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1 transition-colors">
          Compare Specs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
};
