import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { CloudDataProvider } from './context/CloudDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { CommandPalette } from './components/common/CommandPalette';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ComparePage } from './pages/ComparePage';
import { MatrixPage } from './pages/MatrixPage';
import { ManagePage } from './pages/ManagePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import {
  Columns2,
  Home,
  Search,
  TableProperties,
  Settings,
  Cloud,
  ShieldCheck,
  Lock,
  LogOut,
  ArrowLeftRight
} from 'lucide-react';

interface NavigationBarProps {
  onOpenCommandPalette: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onOpenCommandPalette }) => {
  const location = useLocation();
  const { isAdmin, logout, openLoginModal } = useAuth();
  const isAdminLoginRoute = location.pathname === '/admin-login';

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Enhanced Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Emblem Icon */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0078D4] via-blue-600 to-[#FF9900] p-0.5 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <Cloud className="w-5 h-5 text-sky-400 absolute inset-0 m-auto -translate-x-0.5 -translate-y-0.5 opacity-90" />
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF9900] absolute bottom-1.5 right-1.5 drop-shadow-sm" />
            </div>
          </div>

          {/* Title & Subtitle Tagline */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight font-mono text-slate-900 dark:text-slate-100 leading-none">
                Cloud<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0078D4] via-blue-500 to-[#FF9900]">Compare</span>
              </span>
            </div>
            <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0078D4]" />
                Azure
              </span>
              <span className="text-slate-300 dark:text-slate-700 font-sans">vs</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900]" />
                AWS Reference
              </span>
            </span>
          </div>
        </Link>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <Home className="w-4 h-4" /> Home
          </NavLink>

          <NavLink
            to="/browse"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <Search className="w-4 h-4" /> Browse
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <Columns2 className="w-4 h-4" /> Inspector
          </NavLink>

          <NavLink
            to="/matrix"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }
          >
            <TableProperties className="w-4 h-4" /> Matrix
          </NavLink>

          {/* Manage route is ONLY shown if user is authenticated as Admin */}
          {isAdmin && (
            <NavLink
              to="/manage"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Settings className="w-4 h-4" /> Manage
            </NavLink>
          )}
        </nav>

        {/* Right Controls (Cmd + K Search & Admin Controls) */}
        <div className="flex items-center gap-2">
          {/* Quick Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Open Quick Command Palette (Cmd + K)"
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Search...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-[10px] font-bold text-slate-500">
              ⌘K
            </kbd>
          </button>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Admin Authorized
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Log out from Admin session"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : isAdminLoginRoute ? (
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 transition-all text-xs font-bold shadow-xs cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Admin Login
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export const AppContent: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      <NavigationBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/matrix" element={<MatrixPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route
            path="/manage"
            element={
              <ProtectedRoute>
                <ManagePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-center text-xs text-slate-400 font-mono space-y-2">
        <p>CloudCompare — Azure vs AWS Technical Architecture Reference Engine</p>
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-sans">
          Made with <span className="text-rose-500">❤️</span> by <span className="font-bold text-slate-700 dark:text-slate-300">Jayraj Singh</span>
        </p>
      </footer>

      <AdminLoginModal />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CloudDataProvider>
          <AppContent />
        </CloudDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
