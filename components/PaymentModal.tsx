import React, { useEffect, useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulPayment: () => void;
  isBlocking?: boolean;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const CopyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
);

const WhatsAppIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l.217.324-1.251 4.565 4.654-1.239.308.216z" />
    </svg>
);


const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccessfulPayment, isBlocking = false }) => {
  const [copied, setCopied] = useState(false);
  const accountNumber = '1671291391';
  const whatsappNumber = '6281517361321';
  const whatsappMessage = "Halo, saya sudah melakukan pembayaran untuk akses Kontenia. Berikut bukti transfernya.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBlocking) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setCopied(false); // Reset copied state when modal opens
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, isBlocking]);

  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isBlocking) {
        onClose();
    }
  }

  const handleCopy = () => {
      navigator.clipboard.writeText(accountNumber).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {!isBlocking && (
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors z-10"
                aria-label="Tutup Modal Pembayaran"
            >
                <CloseIcon />
            </button>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lakukan Pembayaran</h2>
        <p className="text-gray-600 mb-6">Untuk mendapatkan akses, silakan transfer manual ke rekening berikut:</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
            <p className="text-sm font-semibold text-gray-800">Bank Central Asia (BCA)</p>
            <div className="flex items-center justify-between mt-1">
                <p className="text-xl font-bold text-brand-primary tracking-wider">{accountNumber}</p>
                <button onClick={handleCopy} className="text-sm flex items-center gap-1 text-brand-secondary hover:text-brand-primary font-semibold px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors">
                    <CopyIcon />
                    {copied ? 'Tersalin!' : 'Salin'}
                </button>
            </div>
        </div>

        <div className="my-4">
            <p className="text-sm text-gray-500">Total Pembayaran</p>
            <p className="text-3xl font-extrabold text-gray-900">Rp 99.000</p>
        </div>
        
        <p className="text-xs text-gray-500 mb-6">
            Setelah transfer, klik tombol di bawah untuk mengirim bukti pembayaran ke WhatsApp. <strong>Kode Akses,</strong> akan diberikan setelah pembayaran diverifikasi dan Anda bisa akses semua fitur kembali.
        </p>

        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSuccessfulPayment}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
        >
            <WhatsAppIcon />
            Kirim Bukti via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default PaymentModal;