import React, { useState } from 'react';

const SuggestionPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      return;
    }

    const subject = encodeURIComponent('Saran & Masukan untuk Kontenia');
    const body = encodeURIComponent(
      `Halo Tim Kontenia,\n\nBerikut adalah saran dari saya:\n\nSaran:\n${suggestion}\n\nDari:\nNama: ${name || 'Tidak disebutkan'}\nEmail: ${email || 'Tidak disebutkan'}`
    );

    window.location.href = `mailto:timkontenia@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="flex-grow w-full bg-brand-background text-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            Berikan Saran & Masukan
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Kami sangat menghargai masukan Anda untuk membuat Kontenia lebih baik lagi. Fitur ini khusus untuk pengguna yang telah melakukan upgrade.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">Terima Kasih!</h3>
            <p>Aplikasi email Anda seharusnya sudah terbuka. Silakan kirim saran Anda dari sana. Kami sangat menghargai waktu dan masukan Anda.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Nama (Opsional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                  placeholder="email@anda.com"
                />
              </div>
              <div>
                <label htmlFor="suggestion" className="block text-sm font-semibold text-gray-700 mb-1">
                  Saran atau Masukan Anda <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                  rows={6}
                  placeholder="Tuliskan ide, saran, atau laporan bug yang Anda temukan..."
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!suggestion.trim()}
                  className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kirim Saran via Email
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
};

export default SuggestionPage;
