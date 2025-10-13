import React, { useState } from 'react';
import { useProfile } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface HeaderProps {
  onGoHome: () => void;
  onGoToFAQ: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onGoToAuth: () => void;
}

const LogoIcon = () => (
  <img 
    src="https://imgur.com/R7KbsF0.jpg" 
    alt="Kontenia Logo" 
    className="w-12 h-12 rounded-full object-cover" 
  />
);

const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

const Header: React.FC<HeaderProps> = ({ onGoHome, onGoToFAQ, onOpenTerms, onOpenPrivacy, onGoToAuth }) => {
  const { session, profile } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
    onGoHome(); // Redirect to home after logout
  };

  return (
    <div className="w-full px-4 pt-4 sm:px-6 lg:px-8">
      <header className="w-full rounded-xl shadow-lg bg-gradient-to-r from-brand-primary to-teal-500">
        <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-row items-center justify-between">
          <button
            onClick={onGoHome}
            className="flex items-center gap-4 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-white rounded-lg"
            aria-label="Kembali ke halaman utama"
          >
            <LogoIcon />
            <h1 className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors">Kontenia</h1>
          </button>
          <div className="relative flex items-center gap-4">
            <button
              onClick={onGoToFAQ}
              className="hidden sm:flex items-center gap-2 text-white/90 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              aria-label="Buka halaman FAQ"
            >
              FAQ
            </button>
            
            {session ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-white text-sm font-medium truncate max-w-xs">{profile?.email}</span>
                <button onClick={handleLogout} className="bg-white text-brand-secondary font-bold py-2 px-4 rounded-lg text-sm transition-transform hover:scale-105">
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onGoToAuth}
                className="hidden sm:block bg-white text-brand-secondary font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 shadow"
              >
                Masuk / Daftar
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-white p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Buka menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {isMobileMenuOpen && (
              <div className="sm:hidden absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5">
                {session ? (
                  <div className="p-2 border-b border-gray-100">
                    <p className="px-2 py-1 text-sm text-gray-500 truncate">{profile?.email}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full mt-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="p-2 border-b border-gray-100">
                    <button
                      onClick={() => { onGoToAuth(); setIsMobileMenuOpen(false); }}
                      className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md text-sm"
                    >
                      Masuk / Daftar
                    </button>
                  </div>
                )}
                <a onClick={() => { onGoToFAQ(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">FAQ</a>
                <a onClick={() => { onOpenTerms(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Syarat & Ketentuan</a>
                <a onClick={() => { onOpenPrivacy(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kebijakan Privasi</a>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;