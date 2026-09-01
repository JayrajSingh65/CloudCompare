import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChangePasswordModal } from '../components/auth/ChangePasswordModal';
import { ShieldCheck, KeyRound, AlertCircle, ArrowLeft, Settings, LogOut, Key } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setPassword('');
      setError(false);
      navigate('/manage');
    } else {
      setError(true);
    }
  };

  if (isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
            Admin Session Active
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You are currently authenticated as an Administrator. You have full access to the Content Manager.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/manage"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Settings className="w-4 h-4" /> Go to Content Manager
          </Link>
          <button
            onClick={() => setIsChangePassOpen(true)}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Key className="w-4 h-4 text-blue-500" /> Change Admin Passcode
          </button>
          <button
            onClick={logout}
            className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-xs font-bold text-rose-700 dark:text-rose-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" /> End Admin Session (Logout)
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Dashboard
          </Link>
        </div>

        <ChangePasswordModal
          isOpen={isChangePassOpen}
          onClose={() => setIsChangePassOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <ShieldCheck className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
          Admin Authentication
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Enter admin credentials to unlock Content Management and editing privileges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Admin Passkey
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter passcode..."
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
          <div className="p-3 bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Invalid admin key. Please try again.</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-400 transition-all cursor-pointer shadow-md"
        >
          Authenticate Admin
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Dashboard
        </Link>
      </div>
    </div>
  );
};
