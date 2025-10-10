import React, { useState } from 'react';
import Modal from './Modal';

interface ImageGridProps {
  images: string[];
}

const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = (e: React.MouseEvent, imageUrl: string, index: number) => {
    e.stopPropagation(); // Mencegah modal terbuka saat tombol download diklik
    const link = document.createElement('a');
    link.href = imageUrl;
    
    // Ekstrak tipe mime untuk menentukan ekstensi file
    const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));
    const extension = mimeType.split('/')[1] || 'png';

    link.download = `kontenia-generated-${index + 1}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Hasil Foto Iklan</h2>
        <p className="text-gray-600 mb-3">Klik gambar untuk melihat versi besar.</p>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${images.length > 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
              onClick={() => openModal(image)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openModal(image)}
              aria-label={`Lihat gambar ${index + 1} lebih besar`}
            >
              <img src={image} alt={`Generated Ad ${index + 1}`} className="w-full h-full object-cover aspect-square" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={(e) => handleDownload(e, image, index)}
                  className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 bg-brand-secondary text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold"
                  aria-label={`Unduh gambar ${index + 1}`}
                >
                  <DownloadIcon />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={!!selectedImage} onClose={closeModal} imageUrl={selectedImage} />
    </>
  );
};

export default ImageGrid;