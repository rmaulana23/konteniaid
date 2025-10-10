import React, { useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors z-10"
          aria-label="Tutup Syarat & Ketentuan"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Syarat & Ketentuan Penggunaan</h2>
        <p className="text-xs text-gray-500 mb-6">Terakhir diperbarui: 9/10/2025</p>
        
        <div className="space-y-4 text-sm">
            <p>Selamat datang di Kontenia, platform berbasis kecerdasan buatan (AI) yang membantu Anda membuat iklan produk profesional secara instan.</p>
            <p>Dengan menggunakan layanan ini, Anda menyetujui Syarat & Ketentuan berikut. Mohon dibaca dengan seksama sebelum menggunakan layanan kami.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">1. Penerimaan Syarat</h3>
            <p>Dengan mengakses atau menggunakan Kontenia, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi dari Syarat & Ketentuan ini. Jika Anda tidak menyetujui sebagian atau seluruhnya, harap tidak menggunakan layanan kami.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">2. Login & Akses Pengguna</h3>
            <p>Akses layanan hanya dapat dilakukan dengan login menggunakan akun Google. Kami tidak menyimpan kata sandi atau data sensitif dari akun Google Anda. Login ini hanya digunakan untuk keperluan autentikasi, pencatatan batas penggunaan harian, dan menjaga keamanan akun Anda di platform kami.</p>
            
            <h3 className="text-lg font-semibold text-gray-900 pt-4">3. Batasan Penggunaan (Quota)</h3>
            <p>Setiap pengguna memiliki batas generate gambar sebanyak 50 kali per hari selama masa Early Access. Kuota akan otomatis diperbarui setiap hari pukul 00:00 WIB. Penggunaan melebihi batas akan ditolak hingga kuota diperbarui kembali. Kami berhak menyesuaikan jumlah kuota kapan saja tanpa pemberitahuan sebelumnya.</p>
            
            <h3 className="text-lg font-semibold text-gray-900 pt-4">4. Konten & Hak Cipta</h3>
            <p>Semua gambar yang dihasilkan oleh sistem AI bersifat otomatis dan tidak dijamin 100% unik. Pengguna bertanggung jawab penuh atas konten yang diunggah dan hasil yang dihasilkan dari layanan ini. Dilarang menggunakan layanan ini untuk membuat atau menyebarkan konten yang melanggar hukum, termasuk namun tidak terbatas pada:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Pornografi, kekerasan, diskriminasi, ujaran kebencian, atau SARA.</li>
                <li>Pelanggaran merek dagang, hak cipta, atau identitas pihak lain.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">5. Privasi & Keamanan Data</h3>
            <p>Kami hanya mengumpulkan data minimal: email Google dan ID unik pengguna. Data ini digunakan semata-mata untuk:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Mengelola kuota harian,</li>
                <li>Menyimpan histori penggunaan,</li>
                <li>Menjaga keamanan sistem.</li>
            </ul>
            <p>Kami tidak menjual atau membagikan data pengguna kepada pihak ketiga. Layanan ini menggunakan sistem Supabase dan Google API yang sudah memiliki standar keamanan industri.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">6. Ketersediaan & Perubahan Layanan</h3>
            <p>Layanan ini masih dalam tahap Early Access dan dapat mengalami pembaruan, perbaikan, atau gangguan sewaktu-waktu. Kami berhak menambah, menghapus, atau memodifikasi fitur tanpa pemberitahuan sebelumnya.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">7. Penolakan Tanggung Jawab</h3>
            <p>Kontenia tidak bertanggung jawab atas hasil visual yang tidak sesuai dengan ekspektasi pengguna. Semua hasil adalah keluaran otomatis dari sistem AI yang bersifat eksperimental. Pengguna wajib memastikan hasil akhir sesuai dengan standar hukum dan etika yang berlaku.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">8. Perubahan Syarat & Ketentuan</h3>
            <p>Kami dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Versi terbaru akan ditampilkan di situs, dan tanggal pembaruan akan disertakan di bagian atas dokumen.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">9. Kontak</h3>
            <p>Untuk pertanyaan, laporan, atau masukan, Anda dapat menghubungi kami melalui:<br/>📧 aikistudio@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;