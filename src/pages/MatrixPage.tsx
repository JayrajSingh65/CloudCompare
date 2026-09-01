import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCloudData } from '../context/CloudDataContext';
import { useAuth } from '../context/AuthContext';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import type { ServiceCategory } from '../types/cloud';
import {
  TableProperties,
  Columns2,
  Search,
  PlusCircle
} from 'lucide-react';

export const MatrixPage: React.FC = () => {
  const navigate = useNavigate();
  const { pairs, getService, categories } = useCloudData();
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPairs = pairs.filter(pair => {
    const azureServ = getService(pair.azureServiceId);
    const awsServ = getService(pair.awsServiceId);

    if (selectedCategory !== 'all' && pair.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const azMatch = azureServ?.serviceName.toLowerCase().includes(q);
      const awsMatch = awsServ?.serviceName.toLowerCase().includes(q);
      const catMatch = pair.category.toLowerCase().includes(q);
      const sumMatch = pair.summaryOfDifferences.toLowerCase().includes(q);
      if (!azMatch && !awsMatch && !catMatch && !sumMatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 mb-2">
            <TableProperties className="w-3.5 h-3.5 text-blue-500" /> Comparison Matrix & Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
            Cloud Service Equivalency Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scan all paired Azure vs AWS service equivalents across categories at a glance
          </p>
        </div>

        {/* Link New Pair button is ONLY shown if user is an Admin */}
        {isAdmin && (
          <Link
            to="/manage"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-400 dark:hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" /> Link New Pair
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search matrix pairs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
            <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Category:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({pairs.length})
            </button>
            {categories.map(cat => (
              <CategoryBadge
                key={cat}
                category={cat}
                selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold font-mono uppercase">
                <th className="py-4 px-4 w-1/12">Domain</th>
                <th className="py-4 px-4 w-3/12 text-[#0078D4]">Azure Service</th>
                <th className="py-4 px-4 w-3/12 text-[#FF9900]">AWS Service</th>
                <th className="py-4 px-4 w-4/12">Key Architectural Note / Verdict</th>
                <th className="py-4 px-4 w-1/12 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredPairs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-mono">
                    No paired comparisons match selected matrix filters.
                  </td>
                </tr>
              ) : (
                filteredPairs.map(pair => {
                  const azureService = getService(pair.azureServiceId);
                  const awsService = getService(pair.awsServiceId);

                  if (!azureService || !awsService) return null;

                  return (
                    <tr
                      key={pair.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() =>
                        navigate(`/compare?azure=${azureService.id}&aws=${awsService.id}`)
                      }
                    >
                      <td className="py-4 px-4 align-top">
                        <CategoryBadge category={pair.category} />
                      </td>

                      <td className="py-4 px-4 align-top border-r border-slate-100 dark:border-slate-800/60">
                        <div className="space-y-1">
                          <PlatformBadge platform="azure" size="sm" />
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#0078D4] transition-colors">
                            {azureService.serviceName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                            {azureService.pricingModel}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top border-r border-slate-100 dark:border-slate-800/60">
                        <div className="space-y-1">
                          <PlatformBadge platform="aws" size="sm" />
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#FF9900] transition-colors">
                            {awsService.serviceName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                            {awsService.pricingModel}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {pair.keyVerdict || pair.summaryOfDifferences}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-right align-middle">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/compare?azure=${azureService.id}&aws=${awsService.id}`);
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900 text-slate-700 dark:text-slate-300 transition-colors inline-flex items-center gap-1 font-bold text-xs"
                        >
                          <Columns2 className="w-3.5 h-3.5" /> Compare
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
