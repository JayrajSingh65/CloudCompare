import React from 'react';
import { Award, Scale } from 'lucide-react';

interface SummaryCalloutProps {
  azureServiceName: string;
  awsServiceName: string;
  summary: string;
  verdict?: string;
}

export const SummaryCallout: React.FC<SummaryCalloutProps> = ({
  summary,
  verdict
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Scale className="w-48 h-48 text-blue-400" />
      </div>

      <div className="relative space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-400" /> Architect's Comparison Brief
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Executive Summary of Architectural Differences
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {summary}
          </p>
        </div>

        {verdict && (
          <div className="pt-4 border-t border-slate-800/80 space-y-1">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Verdict & Decision Matrix:
            </h4>
            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              {verdict}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
