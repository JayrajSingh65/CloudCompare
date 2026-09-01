import React from 'react';
import { RefreshCw, ExternalLink, Code2 } from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';

export const Footer: React.FC = () => {
  const { resetToSeedData, services, pairs } = useCloudData();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
              <span className="text-[#0078D4]">Azure</span> vs <span className="text-[#FF9900]">AWS</span> CloudCompare
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              A precision side-by-side technical reference tool built for software engineers, cloud architects, and DevOps professionals comparing equivalent Azure and AWS cloud services and configuration options.
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs font-mono text-slate-400">
              <span>{services.length} Services</span>
              <span>•</span>
              <span>{pairs.length} Comparison Pairs</span>
              <span>•</span>
              <span>Local Storage V1</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3 font-mono">
              Quick Reference
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="https://learn.microsoft.com/en-us/azure/architecture/aws-professional/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                >
                  Microsoft Azure for AWS Professionals <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://aws.amazon.com/solutions/case-studies/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1"
                >
                  AWS Cloud Architecture Center <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3 font-mono">
              Data Controls
            </h4>
            <button
              onClick={() => {
                if (confirm('Reset database to initial seed dataset? Any custom added services will be restored.')) {
                  resetToSeedData();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Seed Data
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono">
          <div>© {new Date().getFullYear()} CloudCompare. Open Architecture.</div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <Code2 className="w-3.5 h-3.5" /> React 19 + TypeScript + Tailwind CSS v4
          </div>
        </div>
      </div>
    </footer>
  );
};
