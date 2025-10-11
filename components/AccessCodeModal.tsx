import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
}

const KeyIcon = () => (
    <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
);


const AccessCodeModal: React.FC<AccessCodeModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const isSuccess = await onVerify(code.trim());

    if (!isSuccess) {
      setError('Kode akses tidak valid atau terjadi kesalahan. Silakan coba lagi.');
    }
    // On success, the parent component handles closing the modal.
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 sm:p-8 text-center"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <KeyIcon />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Masukkan Kode Akses</h2>
        <p className="text-gray-600 mb-6">Masa coba gratis Anda telah berakhir. Masukkan kode akses yang Anda dapatkan setelah upgrade untuk melanjutkan.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full text-center tracking-widest font-mono bg-white border border-gray-300 text-gray-900 text-lg py-2 px-3 rounded-lg focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                    placeholder="KODE-AKSES-ANDA"
                    disabled={isLoading}
                    aria-label="Access Code Input"
                />
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Memverifikasi...
                </>
              ) : (
                'Gunakan Kode'
              )}
            </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-6">
            Belum punya kode?{' '}
            <button onClick={onClose} className="font-semibold text-brand-secondary hover:underline">
                Lihat cara upgrade
            </button>
        </p>
      </div>
    </div>
  );
};

export default AccessCodeModal;
