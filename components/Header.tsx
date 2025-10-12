import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProgressBar from './ProgressBar';

interface HeaderProps {
  onGoHome: () => void;
  onGoDashboard: () => void;
  onGoToFAQ: () => void; // Prop baru untuk ke halaman FAQ
  onUpgradeClick: () => void; // Prop baru untuk membuka modal pembayaran
  isTrialOver?: boolean;
}

const LogoIcon = () => (
  <img 
    src="https://imgur.com/R7KbsF0.jpg" 
    alt="Kontenia Logo" 
    className="w-12 h-12 rounded-full object-cover" 
  />
);

const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
);

const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
);

const UpgradeIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

const FAQIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 2.21-1.79 4-4 4-1.742 0-3.223-.835-3.772-2M12 18v.01"></path></svg>
);


const Header: React.FC<HeaderProps> = ({ onGoHome, onGoDashboard, onGoToFAQ, onUpgradeClick, isTrialOver }) => {
  const { user, profile, login, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onGoHome();
  };

  return (
    <>
      {/* Wrapper div provides space from the viewport edges, making the header "float" within the page. */}
      <div className="w-full px-4 pt-4 sm:px-6 lg:px-8">
        {/* The header is full-width within the padded parent, with rounded corners and shadow for a floating effect. */}
        <header className="w-full rounded-xl shadow-lg bg-gradient-to-r from-brand-primary to-teal-500">
          {/* This inner div constrains the content to a max-width and centers it. */}
          <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
            <button
              onClick={onGoHome}
              disabled={isTrialOver}
              className="flex items-center gap-4 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Kembali ke halaman utama"
            >
              <LogoIcon />
              <h1 className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors">Kontenia</h1>
            </button>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <button
                onClick={onGoToFAQ}
                className="flex items-center gap-2 text-white/90 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                aria-label="Buka halaman FAQ"
              >
                
                FAQ
              </button>
              {/* --- START: Temporarily hidden login/user section --- */}
              {/*
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-4">
                      {profile && !profile.is_admin && !profile.is_paid && (
                        <button
                            onClick={onUpgradeClick}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-1 px-3 rounded-full text-xs transition-colors flex items-center gap-1 shadow-sm transform hover:scale-105"
                            aria-label="Upgrade to Pro"
                        >
                            <UpgradeIcon />
                            Upgrade
                        </button>
                      )}
                      {profile && !profile.is_admin && (
                        <div className="w-40">
                          <ProgressBar
                            value={profile.generation_count}
                            limit={profile.generation_limit}
                            theme="dark"
                          />
                        </div>
                      )}
                      <span className="text-white text-sm whitespace-nowrap" aria-label="User welcome">
                        Halo, {profile?.full_name || user.email}
                      </span>
                  </div>

                  {profile?.is_admin && (
                    <button
                      onClick={onGoDashboard}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      aria-label="Buka Dashboard Admin"
                    >
                      <DashboardIcon />
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500/100 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  className="hidden sm:flex items-center gap-2 bg-white hover:bg-gray-100 text-brand-secondary font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
                  aria-label="Login with Google"
                >
                  <GoogleIcon />
                  Login dengan Google
                </button>
              )}
              */}
              {/* --- END: Temporarily hidden login/user section --- */}
            </div>
          </div>
        </header>
      </div>

      {/* --- START: Temporarily hidden mobile login button --- */}
      {/*
      {!user && (
        <div className="sm:hidden mx-4 mt-4">
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-brand-secondary font-semibold py-3 px-4 rounded-lg transition-colors shadow-md"
              aria-label="Login with Google"
            >
              <GoogleIcon />
              Login dengan Google
            </button>
        </div>
      )}
      */}
      {/* --- END: Temporarily hidden mobile login button --- */}
    </>
  );
};

export default Header;