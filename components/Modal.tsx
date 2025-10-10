import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Mencegah scroll di latar belakang
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat mengklik area konten
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 transition-colors z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Tutup pratinjau gambar"
        >
          <CloseIcon />
        </button>
        <img
          src={imageUrl}
          alt="Pratinjau iklan yang diperbesar"
          className="w-full h-full object-contain rounded-lg max-h-[90vh]"
        />
      </div>
    </div>
  );
};

export default Modal;