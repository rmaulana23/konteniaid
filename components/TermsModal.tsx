import React, { useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Syarat & Ketentuan Penggunaan Kontenia</h2>
        <p className="text-xs text-gray-500 mb-6">Terakhir diperbarui: 9/10/2025</p>
        
        <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-gray-900 pt-4">1. Ketentuan Umum</h3>
            <p>Selamat datang di Kontenia. Dengan mengakses dan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini.</p>
            <p>Layanan Kontenia ditujukan untuk pengguna individu yang ingin membuat konten visual menggunakan teknologi AI, tanpa perlu membuat akun atau login.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">2. Akses dan Penggunaan</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Akses ke fitur AI generator diberikan setelah pembayaran satu kali (one-time payment).</li>
                <li>Pengguna akan menerima kode akses unik untuk menggunakan fitur selama periode tertentu atau hingga batas penggunaan habis (sesuai paket yang dibeli).</li>
                <li>Kode akses tidak dapat dipindahtangankan atau digunakan oleh lebih dari satu orang dalam waktu bersamaan.</li>
                <li>Kontenia berhak menonaktifkan kode akses jika terdeteksi penyalahgunaan, pelanggaran, atau penggunaan berlebihan yang melanggar kebijakan sistem.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">3. Batasan Penggunaan AI</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Setiap pengguna memiliki batas jumlah generate sesuai paket yang dibeli.</li>
                <li>Hasil generate dapat berbeda-beda tergantung prompt, model AI, dan kondisi sistem.</li>
                <li>Kontenia tidak menjamin hasil gambar akan selalu sempurna atau sesuai ekspektasi pengguna.</li>
                <li>Dilarang menggunakan layanan untuk membuat konten yang bersifat:
                    <ul className="list-circle pl-5 mt-1">
                        <li>Pornografi, kekerasan, kebencian, diskriminasi, atau pelanggaran hukum.</li>
                        <li>Pelanggaran hak cipta, merek dagang, atau hak pribadi pihak lain.</li>
                    </ul>
                </li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 pt-4">4. Pembayaran dan Kebijakan Refund</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Pembayaran bersifat final dan tidak dapat dikembalikan (non-refundable), kecuali ada kesalahan teknis yang terbukti berasal dari sistem Kontenia.</li>
                <li>Semua transaksi dilakukan secara aman melalui penyedia pembayaran resmi.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">5. Kepemilikan dan Hak Cipta</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Hasil gambar yang dihasilkan melalui Kontenia menjadi milik pengguna sepenuhnya, kecuali digunakan untuk tujuan ilegal atau melanggar hukum.</li>
                <li>Namun, Kontenia berhak menggunakan hasil generate anonim untuk keperluan promosi atau pengembangan sistem (tanpa mencantumkan data pribadi pengguna).</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">6. Pembatasan Tanggung Jawab</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Kontenia tidak bertanggung jawab atas kerugian langsung maupun tidak langsung akibat penggunaan layanan.</li>
                <li>Pengguna sepenuhnya bertanggung jawab atas konten yang dihasilkan dan penggunaannya.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">7. Perubahan dan Pembaruan</h3>
            <p>Syarat & Ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Pengguna disarankan untuk memeriksa halaman ini secara berkala.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">8. Kontak</h3>
            <p>Untuk pertanyaan atau bantuan, hubungi kami melalui email resmi Kami di timkontenia@gmail.com.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;