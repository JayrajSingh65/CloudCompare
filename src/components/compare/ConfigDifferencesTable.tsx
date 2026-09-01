import React from 'react';
import type { ConfigOption } from '../../types/cloud';
import { Sliders } from 'lucide-react';

interface ConfigDifferencesTableProps {
  azureConfigs: ConfigOption[];
  awsConfigs: ConfigOption[];
  azureServiceName: string;
  awsServiceName: string;
}

export const ConfigDifferencesTable: React.FC<ConfigDifferencesTableProps> = ({
  azureConfigs,
  awsConfigs,
  azureServiceName,
  awsServiceName
}) => {
  // Collect all unique option key names across both services
  const allOptionNames = Array.from(
    new Set([
      ...azureConfigs.map(c => c.name),
      ...awsConfigs.map(c => c.name)
    ])
  );

  if (allOptionNames.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400 font-mono">
        No configuration parameters cataloged for this service pair yet.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold mb-1">
            <Sliders className="w-3.5 h-3.5" /> Spec Matrix
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
            Aligned Configuration & Settings Comparison
          </h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {allOptionNames.length} Parameters
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono uppercase">
              <th className="py-3 px-4 w-1/4">Configuration Option</th>
              <th className="py-3 px-4 w-3/8 text-[#0078D4]">{azureServiceName} (Azure)</th>
              <th className="py-3 px-4 w-3/8 text-[#FF9900]">{awsServiceName} (AWS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {allOptionNames.map(optName => {
              const azureOpt = azureConfigs.find(c => c.name.toLowerCase() === optName.toLowerCase());
              const awsOpt = awsConfigs.find(c => c.name.toLowerCase() === optName.toLowerCase());

              const isDifferent =
                azureOpt?.defaultValue !== awsOpt?.defaultValue || !azureOpt || !awsOpt;

              return (
                <tr
                  key={optName}
                  className={`transition-colors ${
                    isDifferent
                      ? 'bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50/60 dark:hover:bg-amber-950/20'
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  {/* Parameter Name & Description */}
                  <td className="py-4 px-4 align-top font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <div>{optName}</div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400 leading-normal">
                        {azureOpt?.description || awsOpt?.description || 'N/A'}
                      </div>
                    </div>
                  </td>

                  {/* Azure Value */}
                  <td className="py-4 px-4 align-top border-r border-slate-100 dark:border-slate-800">
                    {azureOpt ? (
                      <div className="space-y-1">
                        <span className="font-mono text-xs px-2 py-1 rounded-md bg-sky-50 dark:bg-sky-950/60 text-[#0078D4] dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 inline-block font-semibold">
                          {azureOpt.defaultValue}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 font-mono italic">
                        Not applicable / Default
                      </span>
                    )}
                  </td>

                  {/* AWS Value */}
                  <td className="py-4 px-4 align-top">
                    {awsOpt ? (
                      <div className="space-y-1">
                        <span className="font-mono text-xs px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 inline-block font-semibold">
                          {awsOpt.defaultValue}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 font-mono italic">
                        Not applicable / Default
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
