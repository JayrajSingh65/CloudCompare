import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, KeyRound, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (isAdmin) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
        <ShieldAlert className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
          Admin Access Restricted
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The Content Manager is restricted to authorized cloud administrators. Please log in at <code className="font-bold text-blue-600 dark:text-blue-400 font-mono">/admin-login</code> to proceed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Enter Admin Passkey
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              placeholder="Default passcode: admin123"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-medium">
            Incorrect admin key. Please try again.
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-400 transition-all cursor-pointer shadow-md"
        >
          Unlock Content Manager
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <Link
          to="/admin-login"
          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-bold"
        >
          <LogIn className="w-3.5 h-3.5" /> Admin Login Portal
        </Link>
      </div>
    </div>
  );
};
