import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onGetAccess: () => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

// Self-contained interactive slider component
const ImageComparisonSlider: React.FC<{ beforeImage: string; afterImage: string }> = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = React.useState(50);
    const [isDragging, setIsDragging] = React.useState(false);
    const imageContainerRef = React.useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    React.useEffect(() => {
        const upHandler = () => setIsDragging(false);
        window.addEventListener('mouseup', upHandler);
        window.addEventListener('touchend', upHandler);
        return () => {
            window.removeEventListener('mouseup', upHandler);
            window.removeEventListener('touchend', upHandler);
        };
    }, []);

    return (
        <div
            ref={imageContainerRef}
            className="relative w-full aspect-[4/3] overflow-hidden select-none cursor-ew-resize rounded-xl shadow-2xl group"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
        >
            <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div
                className="absolute inset-0 w-full h-full object-cover overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={beforeImage} alt="Before" className="w-full h-full object-cover pointer-events-none" />
            </div>
             <div className="absolute top-3 left-3 bg-white/60 backdrop-blur-sm text-gray-900 font-semibold py-1 px-4 rounded-full text-sm z-10 pointer-events-none">BEFORE</div>
             <div className="absolute top-3 right-3 bg-gradient-to-r from-brand-primary/80 to-teal-500/80 backdrop-blur-sm text-white font-semibold py-1 px-4 rounded-full text-sm z-10 pointer-events-none">AFTER</div>
            <div
                className="absolute inset-y-0 bg-white/80 w-1 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-0"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-600">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
            </div>
        </div>
    );
};


const LandingPage: React.FC<LandingPageProps> = ({ onStart, onGetAccess }) => {
  return (
    <main className="flex-grow w-full bg-brand-background text-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">

        {/* Hero Section */}
        <div className="py-8 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: CTA */}
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                        Bikin Foto Biasa
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-500 mt-2">Jadi Foto Iklan Profesional</span>
                    </h1>
                    <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-gray-600">
                        Manfaatkan kekuatan AI untuk membuat foto iklan yang memukau.
                    </p>
                    <button
                        onClick={onStart}
                        className="mt-8 bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
                    >
                        Coba GRATIS Sekarang
                    </button>
                    
                </div>
                {/* Right Column: Image Slider */}
                <div>
                     <ImageComparisonSlider
                        beforeImage="https://i.imgur.com/ty0kRlb.jpg"
                        afterImage="https://i.imgur.com/O8s6MRU.jpg"
                    />
                </div>
            </div>
        </div>

        {/* Categories Section */}
        <div className="py-12 sm:py-16 bg-gray-50/70 rounded-2xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
            Buat Iklan Profesional untuk Berbagai Kategori
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl">🍫</span>
              <h3 className="text-xl font-bold mt-6 mb-2">Makanan & Minuman</h3>
              <p className="text-gray-600">
                Buat produk Anda melayang dengan efek asap, percikan, dan bahan-bahan segar yang menggugah selera.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl">🛍️</span>
              <h3 className="text-xl font-bold mt-6 mb-2">Fashion & Lifestyle</h3>
              <p className="text-gray-600">
                Tempatkan produk Anda pada model profesional dalam berbagai setelan gaya hidup, dari studio hingga jalanan kota.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col items-center text-center shadow-sm">
              <span className="text-4xl">🚘</span>
              <h3 className="text-xl font-bold mt-6 mb-2">Otomotif</h3>
              <p className="text-gray-600">
                Ubah mobil Anda dengan modifikasi widebody, gaya balap, atau tampilkan dalam adegan sinematik yang dinamis.
              </p>
            </div>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="py-12 sm:py-24 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Satu Harga untuk Akses Penuh
            </h2>
            <p className="max-w-xl mx-auto text-gray-600 mb-12">
                Investasi sekali untuk mendapatkan semua fitur, semua kategori, selamanya. Tanpa biaya bulanan, tanpa batasan.
            </p>
            <div className="flex items-center justify-center">
                {/* All Access Card */}
                <div className="w-full max-w-md rounded-xl p-1 bg-gradient-to-r from-brand-primary to-teal-500 shadow-2xl shadow-blue-500/20 transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-white rounded-lg p-8 h-full relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-primary to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">Early Access</div>
                        <h3 className="text-2xl font-semibold text-gray-900">Akses Penuh Selamanya</h3>
                        <div className="flex items-end justify-center gap-2 my-4">
                            <p className="text-2xl font-medium text-gray-500 line-through">
                                Rp 129rb
                            </p>
                            <p className="text-5xl font-extrabold text-gray-900">
                                Rp 79rb
                            </p>
                        </div>
                        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-500 mb-6">Hanya untuk 50 orang pertama</p>
                        <ul className="space-y-3 text-left text-gray-600 max-w-xs mx-auto">
                             <li className="flex items-center gap-3"><CheckIcon /><span>Akses <strong>Semua</strong> Kategori & Gaya</span></li>
                            <li className="flex items-center gap-3"><CheckIcon /><span>Fitur Modifikasi Lanjutan</span></li>
                            <li className="flex items-center gap-3"><CheckIcon /><span>Hasil Resolusi Kualitas Tinggi</span></li>
                            <li className="flex items-center gap-3"><CheckIcon /><span><strong>Tanpa</strong> Watermark</span></li>
                            
                        </ul>
                        <button
                            onClick={onGetAccess}
                            className="mt-8 w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300"
                        >
                            Dapatkan Akses Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;