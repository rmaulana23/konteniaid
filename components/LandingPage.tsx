import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onGetAccess: () => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const LandingPage: React.FC<LandingPageProps> = ({ onStart, onGetAccess }) => {
  return (
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full text-center">
      {/* Hero Section */}
      <div className="py-12 sm:py-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          Bikin Foto Produk Biasa Menjadi
          <span className="block text-brand-primary">Iklan Profesional Seketika</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Manfaatkan kekuatan AI untuk membuat foto iklan yang memukau, realistis, dan siap meningkatkan penjualan Anda tanpa perlu studio foto.
        </p>
        <button
          onClick={onStart}
          className="mt-8 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 transform hover:scale-105"
        >
          Coba GRATIS Sekarang
        </button>
        <p className="mt-2 text-sm text-gray-500">
          3x Percobaan Tanpa Login
        </p>
      </div>

      {/* Categories Section */}
      <div className="py-12 sm:py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Buat Iklan Profesional untuk Berbagai Kategori
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex flex-col items-center">
            <span className="text-5xl">🍔</span>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Makanan & Minuman</h3>
            <p className="text-gray-600">
              Buat produk Anda melayang dengan efek asap, percikan, dan bahan-bahan segar yang menggugah selera.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex flex-col items-center">
            <span className="text-5xl">👕</span>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Fashion & Lifestyle</h3>
            <p className="text-gray-600">
              Tempatkan produk Anda pada model profesional dalam berbagai setelan gaya hidup, dari studio hingga jalanan kota.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex flex-col items-center">
            <span className="text-5xl">🚗</span>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Otomotif</h3>
            <p className="text-gray-600">
              Ubah mobil Anda dengan modifikasi widebody, gaya balap, atau tampilkan dalam adegan sinematik yang dinamis.
            </p>
          </div>

        </div>
      </div>
      
      {/* Before & After Section */}
      <div className="py-12 sm:py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dari Foto Biasa ke Iklan Luar Biasa
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            Lihat bagaimana AI kami mengubah foto standar menjadi sebuah karya iklan profesional yang dinamis dan menjual.
        </p>
        <div className="space-y-16">
            {/* Food Showcase */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Kategori Makanan & Minuman</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
                    <div className="relative rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white font-semibold py-1 px-4 rounded-full text-sm z-10">BEFORE</div>
                        <img 
                            src="https://i.imgur.com/7cspdoW.jpg" 
                            alt="Minuman sebelum diubah oleh AI" 
                            className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="relative rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute top-3 left-3 bg-brand-primary/80 backdrop-blur-sm text-white font-semibold py-1 px-4 rounded-full text-sm z-10">AFTER</div>
                        <img 
                            src="https://i.imgur.com/SKT1ACY.jpg" 
                            alt="Minuman setelah diubah oleh AI menjadi iklan" 
                            className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            {/* Fashion Showcase */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Kategori Fashion & Lifestyle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
                    <div className="relative rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white font-semibold py-1 px-4 rounded-full text-sm z-10">BEFORE</div>
                        <img 
                            src="https://i.imgur.com/BXXlw9b.jpg" 
                            alt="Produk fashion sebelum diubah oleh AI" 
                            className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="relative rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute top-3 left-3 bg-brand-primary/80 backdrop-blur-sm text-white font-semibold py-1 px-4 rounded-full text-sm z-10">AFTER</div>
                        <img 
                            src="https://i.imgur.com/Rp5JFFU.jpg" 
                            alt="Produk fashion setelah diubah oleh AI menjadi iklan" 
                            className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            {/* Automotive Showcase */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Kategori Otomotif</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
                    <div className="relative rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white font-semibold py-1 px-4 rounded-full text-sm z-10">BEFORE</div>
                        <img 
                            src="https://i.imgur.com/k3WHYVh.jpg" 
                            alt="Mobil sebelum diubah oleh AI" 
                            className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="relative rounded-lg shadow-lg overflow-hidden group">
                        <div className="absolute top-3 left-3 bg-brand-primary/80 backdrop-blur-sm text-white font-semibold py-1 px-4 rounded-full text-sm z-10">AFTER</div>
                        <img 
                            src="https://i.imgur.com/O8s6MRU.jpg" 
                            alt="Mobil setelah diubah oleh AI menjadi iklan" 
                            className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="py-12 sm:py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Investasi Sekali untuk Iklan Tanpa Batas
        </h2>
        <p className="max-w-xl mx-auto text-gray-600 mb-12">
            Satu harga, semua fitur. Dapatkan akses penuh ke Kontenia dan ciptakan iklan sebanyak yang Anda butuhkan.
        </p>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold text-gray-800">Early Access</h3>
            <p className="text-5xl font-extrabold text-gray-900 my-4">
                Rp 129rb
            </p>
            <p className="font-semibold text-brand-primary mb-6">Pembayaran Sekali Saja</p>
            
            <ul className="space-y-3 text-left text-gray-700">
                <li className="flex items-center gap-3">
                    <CheckIcon />
                    <span>Akses <strong>Semua</strong> Kategori & Gaya Iklan</span>
                </li>
                <li className="flex items-center gap-3">
                    <CheckIcon />
                    <span>Fitur Modifikasi Lanjutan</span>
                </li>
                 <li className="flex items-center gap-3">
                    <CheckIcon />
                    <span>Hasil Resolusi Kualitas Tinggi</span>
                </li>
                <li className="flex items-center gap-3">
                    <CheckIcon />
                    <span><strong>Tanpa</strong> Watermark</span>
                </li>
            </ul>
            
            <button
              onClick={onGetAccess}
              className="mt-8 w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 transform hover:scale-105"
            >
              Dapatkan Akses Sekarang
            </button>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;