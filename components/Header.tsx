import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import ProgressBar from './ProgressBar';

interface HeaderProps {
  onGoHome: () => void;
  onGoToFAQ: () => void;
  onGoToAbout: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onGetAccess: () => void;
}

const LogoIcon = () => (
  <img 
    src="https://imgur.com/R7KbsF0.jpg" 
    alt="Kontenia Logo" 
    className="w-12 h-12 rounded-full object-cover" 
  />
);

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);

const Header: React.FC<HeaderProps> = ({ onGoHome, onGoToFAQ, onGoToAbout, onOpenTerms, onOpenPrivacy, onGetAccess }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, profile, login, logout, loading } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userMenuDesktop = (
    <div ref={userMenuRef} className="relative">
      <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 text-white/90 hover:text-white font-semibold p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white">
        <UserIcon />
        <span className="hidden md:inline">{profile?.full_name || profile?.email?.split('@')[0]}</span>
      </button>
      {isUserMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5 text-gray-800">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
          </div>
          <div className="px-4 py-3">
             <p className="text-xs font-semibold text-gray-600 mb-1">Sisa Generasi Hari Ini</p>
             <ProgressBar value={profile?.generation_count || 0} limit={profile?.generation_limit || 0} />
          </div>
          <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogoutIcon />
            Logout
          </button>
        </div>
      )}
    </div>
  );
  
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
            <nav className="hidden sm:flex items-center gap-2">
              <button
                onClick={onGoToFAQ}
                className="text-white/90 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                aria-label="Buka halaman FAQ"
              >
                FAQ
              </button>
              <button
                onClick={onGoToAbout}
                className="text-white/90 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                aria-label="Buka halaman Tentang Kami"
              >
                Tentang
              </button>
            </nav>
            
            <div className="hidden sm:block">
              {loading ? (
                <div className="w-36 h-9 bg-white/20 rounded-lg animate-pulse"></div>
              ) : user ? (
                userMenuDesktop
              ) : (
                <button onClick={login} className="bg-white text-brand-secondary font-bold py-2 px-5 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 shadow">
                  Login dengan Google
                </button>
              )}
            </div>

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
                    {loading ? <div className="p-4"><div className="h-8 bg-gray-200 rounded animate-pulse"></div></div> : (
                        user && profile ? (
                            <>
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-semibold truncate text-gray-800">{profile.full_name}</p>
                                    <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                                    <div className="mt-2">
                                        <p className="text-xs font-semibold text-gray-600 mb-1">Sisa Generasi</p>
                                        <ProgressBar value={profile.generation_count} limit={profile.generation_limit} />
                                    </div>
                                </div>
                                <div className="border-t my-1"></div>
                            </>
                        ) : (
                            <div className="p-2 border-b border-gray-100">
                                <button onClick={() => { login(); setIsMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-all duration-300">
                                    Login dengan Google
                                </button>
                            </div>
                        )
                    )}
                    <a onClick={() => { onGoToFAQ(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">FAQ</a>
                    <a onClick={() => { onGoToAbout(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Tentang</a>
                    <a onClick={() => { onOpenTerms(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Syarat & Ketentuan</a>
                    <a onClick={() => { onOpenPrivacy(); setIsMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kebijakan Privasi</a>
                    {user && (
                      <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogoutIcon /> Logout
                      </button>
                    )}
                </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
