import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    closeLoginModal();
  };

  return (
    <Modal
      isOpen={isLoginModalOpen}
      onClose={handleClose}
      title="Admin Credentials Required"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Content Manager Access
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Enter admin key to unlock editing & service pair creation.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-slate-700 dark:text-slate-300">
            Admin Passkey
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              autoFocus
              placeholder="Default: admin123"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Default passcode for demo: <span className="font-bold text-blue-600 dark:text-blue-400">admin123</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Invalid admin key. Please try again.</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-blue-600 dark:hover:bg-blue-400 transition-all cursor-pointer"
          >
            Authenticate Admin
          </button>
        </div>
      </form>
    </Modal>
  );
};
