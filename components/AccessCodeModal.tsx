import React, { useState, useEffect } from 'react';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  categoryName: string;
  error: string | null;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const AccessCodeModal: React.FC<AccessCodeModalProps> = ({ isOpen, onClose, onSubmit, categoryName, error }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Reset code when modal opens
  useEffect(() => {
    if(isOpen) {
        setCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors z-10"
          aria-label="Tutup Modal Kode Akses"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Masukkan Kode Akses</h2>
        <p className="text-gray-600 mb-6">Untuk melanjutkan ke kategori <span className="font-semibold">{categoryName}</span>.</p>
        
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Kode Akses"
                className="w-full bg-white border border-gray-300 text-gray-900 text-center text-lg py-3 px-4 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors mb-4"
                aria-label="Input Kode Akses"
                autoFocus
            />

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300"
            >
                Lanjutkan
            </button>
        </form>
      </div>
    </div>
  );
};

export default AccessCodeModal;
