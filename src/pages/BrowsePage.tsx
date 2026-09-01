import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCloudData } from '../context/CloudDataContext';
import { useAuth } from '../context/AuthContext';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import type { ServiceCategory, Platform } from '../types/cloud';
import {
  Search,
  Filter,
  Grid,
  List as ListIcon,
  ArrowRight,
  Columns2,
  PlusCircle,
  Lock
} from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { services, categories, getService } = useCloudData();
  const { isAdmin, openLoginModal } = useAuth();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | Platform>(
    (searchParams.get('platform') as any) || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>(
    (searchParams.get('category') as any) || 'all'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pairedOnly, setPairedOnly] = useState(false);

  useEffect(() => {
    const search = searchParams.get('search');
    const cat = searchParams.get('category');
    const plat = searchParams.get('platform');
    if (search !== null) setSearchQuery(search);
    if (cat) setSelectedCategory(cat as any);
    if (plat) setSelectedPlatform(plat as any);
  }, [searchParams]);

  const filteredServices = services.filter(service => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = service.serviceName.toLowerCase().includes(q);
      const catMatch = service.category.toLowerCase().includes(q);
      const descMatch = service.description.toLowerCase().includes(q);
      const featMatch = service.keyFeatures.some(f => f.toLowerCase().includes(q));
      if (!nameMatch && !catMatch && !descMatch && !featMatch) return false;
    }

    if (selectedPlatform !== 'all' && service.platform !== selectedPlatform) {
      return false;
    }

    if (selectedCategory !== 'all' && service.category !== selectedCategory) {
      return false;
    }

    if (pairedOnly && !service.equivalentServiceId) {
      return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('all');
    setPairedOnly(false);
    setSearchParams({});
  };

  const handleAddServiceClick = (e: React.MouseEvent) => {
    if (!isAdmin) {
      e.preventDefault();
      openLoginModal();
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
            Cloud Service Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, filter, and inspect {services.length} Azure and AWS service entries
          </p>
        </div>

        <Link
          to="/manage"
          onClick={handleAddServiceClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-400 dark:hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
        >
          {isAdmin ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
          Add Service Entry
        </Link>
      </div>

      {/* Filter & View Control Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter services by name, keywords, or feature..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Platform Toggle */}
          <div className="md:col-span-4 flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all ${
                selectedPlatform === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setSelectedPlatform('azure')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all ${
                selectedPlatform === 'azure'
                  ? 'bg-[#0078D4] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#0078D4]'
              }`}
            >
              Azure Only
            </button>
            <button
              onClick={() => setSelectedPlatform('aws')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all ${
                selectedPlatform === 'aws'
                  ? 'bg-[#FF9900] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#FF9900]'
              }`}
            >
              AWS Only
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="md:col-span-2 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-slate-500 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-slate-500 transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Bar & Toggle options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Domain:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Categories
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

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={pairedOnly}
                onChange={e => setPairedOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              Show Paired Services Only
            </label>
            {(searchQuery || selectedPlatform !== 'all' || selectedCategory !== 'all' || pairedOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-500 hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Services Listing Section */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Filter className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No services found matching active filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, platform toggle, or domain filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 rounded-xl hover:bg-blue-100"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const equivalent = service.equivalentServiceId
              ? getService(service.equivalentServiceId)
              : undefined;

            return (
              <div
                key={service.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <PlatformBadge platform={service.platform} size="md" />
                    <CategoryBadge category={service.category} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.serviceName}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {service.description.replace(/[#*`]/g, '')}
                  </p>

                  {service.keyFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {service.keyFeatures.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md truncate max-w-[200px]"
                        >
                          • {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    <span className="text-slate-400">Pricing:</span> {service.pricingModel}
                  </div>

                  {equivalent ? (
                    <button
                      onClick={() => {
                        if (service.platform === 'azure') {
                          navigate(`/compare?azure=${service.id}&aws=${equivalent.id}`);
                        } else {
                          navigate(`/compare?azure=${equivalent.id}&aws=${service.id}`);
                        }
                      }}
                      className="w-full inline-flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Columns2 className="w-3.5 h-3.5 text-blue-500" />
                        Compare with {equivalent.serviceName}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      No counterpart linked yet
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono uppercase">
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing Model</th>
                <th className="py-3 px-4">Counterpart Equivalent</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredServices.map(service => {
                const equivalent = service.equivalentServiceId
                  ? getService(service.equivalentServiceId)
                  : undefined;

                return (
                  <tr
                    key={service.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <PlatformBadge platform={service.platform} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {service.serviceName}
                    </td>
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={service.category} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {service.pricingModel}
                    </td>
                    <td className="py-3.5 px-4">
                      {equivalent ? (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {equivalent.serviceName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {equivalent ? (
                        <button
                          onClick={() => {
                            if (service.platform === 'azure') {
                              navigate(`/compare?azure=${service.id}&aws=${equivalent.id}`);
                            } else {
                              navigate(`/compare?azure=${equivalent.id}&aws=${service.id}`);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold hover:bg-blue-600 transition-colors cursor-pointer text-xs"
                        >
                          <Columns2 className="w-3.5 h-3.5" /> Compare
                        </button>
                      ) : (
                        <Link
                          to="/manage"
                          onClick={handleAddServiceClick}
                          className="text-slate-400 hover:text-blue-600 font-medium"
                        >
                          Link Pair
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
