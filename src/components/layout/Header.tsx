import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  Columns2,
  TableProperties,
  PlusCircle,
  Search,
  Sun,
  Moon,
  Cloud,
  X,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCloudData } from '../../context/CloudDataContext';
import { PlatformBadge } from '../common/PlatformBadge';
import { CategoryBadge } from '../common/CategoryBadge';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { services } = useCloudData();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Home', path: '/', icon: Cloud },
    { label: 'Browse Services', path: '/browse', icon: Layers },
    { label: 'Side-by-Side Compare', path: '/compare', icon: Columns2 },
    { label: 'Matrix Overview', path: '/matrix', icon: TableProperties },
    { label: 'Content Manager', path: '/manage', icon: PlusCircle }
  ];

  const filteredSearchResults = searchQuery.trim()
    ? services.filter(
        s =>
          s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.keyFeatures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSelectSearchResult = (serviceId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    const service = services.find(s => s.id === serviceId);
    if (service) {
      if (service.equivalentServiceId) {
        if (service.platform === 'azure') {
          navigate(`/compare?azure=${service.id}&aws=${service.equivalentServiceId}`);
        } else {
          navigate(`/compare?azure=${service.equivalentServiceId}&aws=${service.id}`);
        }
      } else {
        navigate(`/browse?search=${encodeURIComponent(service.serviceName)}`);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center font-bold text-white dark:text-slate-900 shadow-md group-hover:scale-105 transition-transform">
                <span className="text-[#0078D4]">C</span>
                <span className="text-[#FF9900]">C</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  CloudCompare
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">
                  Azure <span className="text-[#0078D4]">vs</span> AWS Reference
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Search & Theme Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search services...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile navigation bar */}
          <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs overflow-x-auto gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  {item.label.split(' ')[0]}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden">
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search Azure or AWS services (e.g. S3, Functions, Blob, EC2)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-4 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto">
              {!searchQuery.trim() ? (
                <div className="p-4 text-center text-xs text-slate-400 font-mono">
                  Type a service name or cloud capability to filter live...
                </div>
              ) : filteredSearchResults.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No services found matching "<span className="font-semibold">{searchQuery}</span>"
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredSearchResults.map(service => (
                    <div
                      key={service.id}
                      onClick={() => handleSelectSearchResult(service.id)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PlatformBadge platform={service.platform} size="sm" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {service.serviceName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                            {service.pricingModel}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={service.category} />
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
