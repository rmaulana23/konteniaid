import React, { useEffect } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulPayment: () => void;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccessfulPayment }) => {
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

  if (!isOpen) return null;

  const handlePaymentConfirmation = () => {
    onSuccessfulPayment();
    onClose();
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
          aria-label="Tutup Modal Pembayaran"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lakukan Pembayaran</h2>
        <p className="text-gray-600 mb-4">Scan QRIS di bawah ini untuk mendapatkan akses penuh.</p>
        
        <div className="p-2 border rounded-lg inline-block">
            {/* Placeholder QRIS Image */}
            <img src="https://i.imgur.com/g2yX3tM.png" alt="QRIS Payment Code" className="w-48 h-48 mx-auto" />
        </div>

        <div className="my-4">
            <p className="text-sm text-gray-500">Total Pembayaran</p>
            <p className="text-3xl font-extrabold text-gray-900">Rp 129.000</p>
        </div>
        
        <p className="text-xs text-gray-500 mb-6">Setelah pembayaran berhasil, klik tombol di bawah ini untuk mengonfirmasi dan mengaktifkan akun Anda.</p>

        <button
            onClick={handlePaymentConfirmation}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 transform hover:scale-105"
        >
            Saya Sudah Bayar
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;