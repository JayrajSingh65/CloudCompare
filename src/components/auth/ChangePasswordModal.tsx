import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const { changePassword } = useAuth();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setStatus({ success: false, message: 'New passwords do not match.' });
      return;
    }

    const res = changePassword(currentPass, newPass);
    setStatus(res);

    if (res.success) {
      setTimeout(() => {
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setStatus(null);
        onClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setStatus(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Admin Passcode"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-blue-500" /> Admin Passcode Security
          </h4>
          <p className="text-slate-500 text-[11px]">
            Update your admin key. Passcodes are saved locally in browser storage.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block font-semibold text-slate-700 dark:text-slate-300">
            Current Passcode
          </label>
          <input
            type="password"
            required
            value={currentPass}
            onChange={e => setCurrentPass(e.target.value)}
            placeholder="Enter current passcode..."
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-semibold text-slate-700 dark:text-slate-300">
            New Admin Passcode
          </label>
          <input
            type="password"
            required
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="Min 4 characters..."
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-semibold text-slate-700 dark:text-slate-300">
            Confirm New Passcode
          </label>
          <input
            type="password"
            required
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            placeholder="Re-enter new passcode..."
            className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        {status && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 font-medium ${
              status.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {status.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>{status.message}</span>
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
            Update Passcode
          </button>
        </div>
      </form>
    </Modal>
  );
};
