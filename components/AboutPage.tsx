import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <main className="flex-grow w-full bg-brand-background text-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            Tentang Kontenia
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Memberdayakan Bisnis Anda dengan Visual Iklan Profesional Berbasis AI.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-10 space-y-8 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Misi Kami</h2>
            <p>
              Misi kami di Kontenia adalah untuk mendemokratisasi pembuatan konten visual berkualitas tinggi. Kami percaya bahwa setiap bisnis, tidak peduli skalanya mulai dari UMKM, pengusaha rumahan, hingga merek yang sedang berkembang berhak memiliki akses ke materi iklan yang profesional tanpa harus mengeluarkan biaya mahal atau memiliki keahlian teknis yang mendalam.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Apa yang Kami Lakukan?</h2>
            <p>
              Kontenia lahir dari sebuah masalah sederhana: membuat foto produk yang menarik itu sulit, memakan waktu, dan mahal. Banyak pelaku usaha kesulitan mengubah foto produk biasa menjadi gambar iklan yang dapat bersaing di pasar digital yang ramai.
            </p>
            <p className="mt-2">
              Kami menyelesaikan masalah ini dengan memanfaatkan kekuatan kecerdasan buatan (AI). Platform kami memungkinkan Anda untuk mengunggah foto produk Anda dan, dalam hitungan detik, mengubahnya menjadi berbagai gaya iklan yang memukau mulai dari foto studio yang bersih, adegan gaya hidup yang natural, hingga konsep sinematik yang dramatis.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Mengapa Memilih Kontenia?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Cepat & Mudah:</strong> Tidak perlu lagi menyewa fotografer atau desainer. Dapatkan hasil profesional hanya dengan beberapa klik.</li>
              <li><strong>Hemat Biaya:</strong> Dapatkan akses ke semua fitur dengan satu kali pembayaran yang terjangkau, tanpa biaya langganan bulanan.</li>
              <li><strong>Hasil Berkualitas Tinggi:</strong> AI kami dilatih untuk menghasilkan gambar yang realistis, dengan pencahayaan, bayangan, dan detail yang setara dengan pemotretan profesional.</li>
              <li><strong>Tanpa Akun, Tanpa Ribet:</strong> Kami menghargai waktu Anda. Langsung gunakan layanan kami tanpa perlu proses pendaftaran yang panjang.</li>
            </ul>
          </div>
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">Punya pertanyaan lebih lanjut atau saran untuk kami?</p>
            <a href="mailto:timkontenia@gmail.com" className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors">
              Hubungi kami kapan saja
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
