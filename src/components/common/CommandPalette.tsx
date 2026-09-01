import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloudData } from '../../context/CloudDataContext';
import { PlatformBadge } from './PlatformBadge';
import { CategoryBadge } from './CategoryBadge';
import { Search, Columns2, Command, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { services, pairs, getService } = useCloudData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredServices = query.trim()
    ? services.filter(
        s =>
          s.serviceName.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase())
      )
    : services.slice(0, 5);

  const filteredPairs = query.trim()
    ? pairs.filter(p => {
        const az = getService(p.azureServiceId);
        const aws = getService(p.awsServiceId);
        const q = query.toLowerCase();
        return (
          az?.serviceName.toLowerCase().includes(q) ||
          aws?.serviceName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.summaryOfDifferences.toLowerCase().includes(q)
        );
      })
    : pairs.slice(0, 4);

  const totalItems = filteredPairs.length + filteredServices.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, totalItems));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % Math.max(1, totalItems));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < filteredPairs.length) {
          const pair = filteredPairs[selectedIndex];
          if (pair) {
            navigate(`/compare?azure=${pair.azureServiceId}&aws=${pair.awsServiceId}`);
            onClose();
          }
        } else {
          const serviceIdx = selectedIndex - filteredPairs.length;
          const service = filteredServices[serviceIdx];
          if (service) {
            const equiv = service.equivalentServiceId
              ? getService(service.equivalentServiceId)
              : undefined;
            if (equiv) {
              if (service.platform === 'azure') {
                navigate(`/compare?azure=${service.id}&aws=${equiv.id}`);
              } else {
                navigate(`/compare?azure=${equiv.id}&aws=${service.id}`);
              }
            } else {
              navigate(`/browse?search=${encodeURIComponent(service.serviceName)}`);
            }
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalItems, filteredPairs, filteredServices, navigate, onClose, getService]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cloud services, equivalents, or specs (Esc to close)..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-sm bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Comparison Pairs Section */}
          {filteredPairs.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                Matched Comparison Pairs ({filteredPairs.length})
              </div>
              {filteredPairs.map((pair, idx) => {
                const az = getService(pair.azureServiceId);
                const aws = getService(pair.awsServiceId);
                const isSelected = idx === selectedIndex;

                if (!az || !aws) return null;

                return (
                  <div
                    key={pair.id}
                    onClick={() => {
                      navigate(`/compare?azure=${pair.azureServiceId}&aws=${pair.awsServiceId}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                        <Columns2 className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {az.serviceName} <span className="text-slate-400 font-normal">vs</span> {aws.serviceName}
                          </span>
                          <CategoryBadge category={pair.category} />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-mono">
                          {pair.keyVerdict || pair.summaryOfDifferences}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
                      Compare →
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Individual Service Entries Section */}
          {filteredServices.length > 0 && (
            <div className="space-y-1 pt-3">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                Services Directory ({filteredServices.length})
              </div>
              {filteredServices.map((service, idx) => {
                const globalIdx = filteredPairs.length + idx;
                const isSelected = globalIdx === selectedIndex;
                const equiv = service.equivalentServiceId
                  ? getService(service.equivalentServiceId)
                  : undefined;

                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      if (equiv) {
                        if (service.platform === 'azure') {
                          navigate(`/compare?azure=${service.id}&aws=${equiv.id}`);
                        } else {
                          navigate(`/compare?azure=${equiv.id}&aws=${service.id}`);
                        }
                      } else {
                        navigate(`/browse?search=${encodeURIComponent(service.serviceName)}`);
                      }
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlatformBadge platform={service.platform} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {service.serviceName}
                          </span>
                          <CategoryBadge category={service.category} />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-mono">
                          {service.pricingModel}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      {equiv ? `Equiv: ${equiv.serviceName}` : 'Inspect'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">
              No matching cloud services or comparison pairs found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs font-bold text-slate-700 dark:text-slate-300">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs font-bold text-slate-700 dark:text-slate-300">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs font-bold text-slate-700 dark:text-slate-300">
                ↵
              </kbd>{' '}
              Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs font-bold text-slate-700 dark:text-slate-300">
                Esc
              </kbd>{' '}
              Close
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3 text-blue-500" /> CloudCompare Quick Access
          </div>
        </div>
      </div>
    </div>
  );
};
