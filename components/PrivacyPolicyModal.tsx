import React, { useEffect } from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
          aria-label="Tutup Kebijakan Privasi"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kebijakan Privasi Kontenia</h2>
        <p className="text-xs text-gray-500 mb-6">Terakhir diperbarui: 9/10/2025</p>
        
        <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-gray-900 pt-4">1. Pendahuluan</h3>
            <p>Kebijakan Privasi ini menjelaskan bagaimana Kontenia mengumpulkan, menggunakan, dan melindungi informasi pengguna saat menggunakan layanan kami. Kontenia berkomitmen menjaga privasi pengguna dan memastikan bahwa semua data yang dikumpulkan digunakan hanya untuk keperluan operasional layanan.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">2. Informasi yang Kami Kumpulkan</h3>
            <p>Karena Kontenia tidak menggunakan sistem login atau pendaftaran akun, kami tidak menyimpan data pribadi pengguna seperti nama, alamat email, atau kata sandi. Namun, kami dapat mengumpulkan data berikut untuk keperluan teknis dan statistik:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Alamat IP dan jenis perangkat yang digunakan untuk akses.</li>
                <li>Informasi penggunaan situs (misalnya jumlah generate yang dilakukan).</li>
                <li>Data pembayaran dari penyedia pembayaran (tanpa menyimpan detail kartu).</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">3. Penggunaan Informasi</h3>
            <p>Data yang dikumpulkan digunakan hanya untuk:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Mengelola akses pengguna berdasarkan kode akses yang dibeli.</li>
                <li>Menjaga stabilitas sistem dan mencegah penyalahgunaan layanan.</li>
                <li>Analisis penggunaan agar kami dapat meningkatkan kualitas fitur.</li>
            </ul>
            <p>Kami tidak menjual, menyewakan, atau membagikan data pengguna kepada pihak ketiga, kecuali jika diwajibkan oleh hukum.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">4. Keamanan Data</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Semua koneksi ke situs Kontenia diamankan dengan HTTPS dan enkripsi SSL.</li>
                <li>Kode akses dan riwayat generate disimpan secara terbatas dan hanya untuk validasi sistem.</li>
                <li>Kami tidak menyimpan informasi pribadi atau file hasil generate milik pengguna setelah sesi selesai.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">5. Penggunaan Layanan AI</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Semua proses generate gambar dilakukan melalui sistem AI pihak ketiga (misalnya Google Gemini).</li>
                <li>Dengan menggunakan Kontenia, pengguna menyetujui bahwa proses generate dapat melalui layanan AI eksternal sesuai kebijakan privasi masing-masing penyedia.</li>
                <li>Kontenia tidak menyimpan atau meninjau konten prompt pengguna kecuali diperlukan untuk pemeliharaan sistem.</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 pt-4">6. Hak Pengguna</h3>
            <p>Pengguna memiliki hak untuk:</p>
             <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Menghapus atau menghentikan penggunaan layanan kapan pun.</li>
                <li>Meminta klarifikasi terkait penyimpanan data teknis yang mungkin terkait dengan kode akses.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">7. Pembaruan Kebijakan</h3>
            <p>Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku segera setelah dipublikasikan di situs resmi Kontenia.</p>

            <h3 className="text-lg font-semibold text-gray-900 pt-4">8. Penolakan Tanggung Jawab</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Kontenia tidak bertanggung jawab atas hasil visual yang tidak sesuai dengan ekspektasi pengguna.</li>
                <li>Semua hasil adalah keluaran otomatis dari sistem AI yang bersifat eksperimental.</li>
                <li>Pengguna wajib memastikan hasil akhir sesuai dengan standar hukum, etika, dan hak cipta yang berlaku.</li>
                <li>Kontenia tidak menjamin bahwa hasil yang dihasilkan bebas dari kesalahan teknis, bias, atau pelanggaran hak pihak ketiga.</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;