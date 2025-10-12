import React, { useState } from 'react';

// Data FAQ
const faqData = [
  {
    question: 'Bagaimana cara kerja AI di Kontenia?',
    answer: 'Kontenia menggunakan model AI generatif canggih (Google Gemini) untuk mengubah foto produk Anda. Saat Anda mengunggah gambar dan memilih gaya, AI menganalisis produk Anda dan menempatkannya dalam adegan baru yang fotorealistik sesuai instruksi yang Anda berikan, lengkap dengan pencahayaan profesional, bayangan, dan detail sinematik.'
  },
  {
    question: 'Apakah saya perlu akun untuk menggunakan layanan ini?',
    answer: 'Tidak, Anda tidak perlu membuat akun. Kontenia dirancang untuk kemudahan dan kecepatan. Anda dapat langsung menggunakan versi percobaan gratis. Untuk akses penuh, Anda hanya perlu melakukan pembayaran dan menggunakan kode akses yang diberikan.'
  },
  {
    question: 'Bagaimana cara mendapatkan kode akses?',
    answer: 'Setelah melakukan pembayaran melalui metode yang tersedia (transfer manual BCA), Anda akan diarahkan untuk mengirim bukti transfer via WhatsApp. Tim kami akan memverifikasi pembayaran Anda dan mengirimkan kode akses unik yang dapat langsung Anda gunakan untuk membuka semua fitur.'
  },
  {
    question: 'Berapa lama kode akses saya berlaku?',
    answer: 'Kode akses yang Anda beli saat ini selama masa Early Access (Uji Coba) bisa Anda gunakan tiap hari. Ini bukan sistem langganan, jadi Anda hanya membayar sekali untuk akses semua fiturnya.'
  },
  {
    question: 'Siapa pemilik hak cipta dari gambar yang dihasilkan?',
    answer: 'Anda memiliki hak penuh atas gambar yang Anda hasilkan menggunakan Kontenia. Anda bebas menggunakannya untuk tujuan komersial seperti iklan, media sosial, atau materi pemasaran lainnya tanpa royalti tambahan.'
  },
  {
    question: 'Mengapa hasil gambar saya terkadang tidak sempurna?',
    answer: 'Teknologi AI generatif masih terus berkembang. Meskipun sangat canggih, hasilnya terkadang bisa bervariasi atau mengandung sedikit ketidaksempurnaan. Untuk hasil terbaik, pastikan Anda mengunggah foto produk dengan kualitas baik, pencahayaan yang jelas, dan latar belakang yang tidak terlalu ramai.'
  },
  {
    question: 'Bisakah saya mendapatkan pengembalian dana (refund)?',
    answer: 'Sesuai dengan Syarat & Ketentuan kami, semua pembayaran bersifat final dan tidak dapat dikembalikan (non-refundable). Hal ini karena setiap proses generasi gambar memerlukan biaya komputasi yang signifikan di sisi kami. Kami menyediakan percobaan gratis agar Anda dapat mencoba layanan sebelum membeli.'
  }
];

// Komponen Ikon Chevron
const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <svg
        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);

// Komponen Item FAQ
const FAQItem: React.FC<{
  item: { question: string; answer: string };
  index: number;
  activeIndex: number | null;
  onToggle: (index: number) => void;
}> = ({ item, index, activeIndex, onToggle }) => {
  const isOpen = activeIndex === index;

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
        <ChevronIcon isOpen={isOpen} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="px-6 pb-5 text-gray-600">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
};


const FAQPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // Buka item pertama secara default

    const handleToggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <main className="flex-grow w-full bg-brand-background text-gray-900">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
                        Frequently Asked Questions (FAQ)
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Punya pertanyaan? Kami punya jawabannya. Temukan informasi yang Anda butuhkan di bawah ini.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    {faqData.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            index={index}
                            activeIndex={activeIndex}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>

                 <div className="text-center mt-12">
                    <p className="text-gray-600">Tidak menemukan jawaban yang Anda cari?</p>
                    <a href="mailto:timkontenia@gmail.com" className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors">
                        Hubungi Tim Support Kami
                    </a>
                </div>
            </div>
        </main>
    );
};

export default FAQPage;