import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import Spinner from './Spinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgotPassword' | 'checkEmail'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: googleLogin, signInWithEmail, signUpWithEmail, sendPasswordResetEmail } = useUser();

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setMode('login');
      setError('');
      setMessage('');
      setEmail('');
      setPassword('');
      setFullName('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    await googleLogin();
    // The page will redirect, so no need to setLoading(false)
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (mode === 'login') {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
      } else {
        onClose();
      }
    } else if (mode === 'signup') {
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) {
        setError(error.message || 'Gagal mendaftar. Coba lagi.');
      } else {
        setMessage(`Email konfirmasi telah dikirim ke ${email}. Silakan periksa kotak masuk Anda.`);
        setMode('checkEmail');
      }
    } else if (mode === 'forgotPassword') {
        const { error } = await sendPasswordResetEmail(email);
        if (error) {
            setError(error.message || 'Gagal mengirim email reset password.');
        } else {
            setMessage(`Email untuk reset password telah dikirim ke ${email}.`);
            setMode('checkEmail');
        }
    }
    setLoading(false);
  };
  
  const renderContent = () => {
    if (mode === 'checkEmail') {
        return (
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Periksa Email Anda</h3>
                <p className="text-gray-600">{message}</p>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition-colors hover:bg-brand-secondary"
                >
                    Tutup
                </button>
            </div>
        );
    }
      
    const isLogin = mode === 'login';
    const isSignup = mode === 'signup';
    const isForgotPassword = mode === 'forgotPassword';

    return (
        <>
            <div className="mb-6 text-center">
                 <h3 className="text-2xl font-bold text-gray-900">
                    {isLogin && 'Selamat Datang Kembali'}
                    {isSignup && 'Buat Akun Baru'}
                    {isForgotPassword && 'Reset Password Anda'}
                 </h3>
                 <p className="text-sm text-gray-500 mt-1">
                    {isLogin && <>Belum punya akun? <button onClick={() => setMode('signup')} className="font-semibold text-brand-secondary hover:underline">Daftar di sini</button></>}
                    {isSignup && <>Sudah punya akun? <button onClick={() => setMode('login')} className="font-semibold text-brand-secondary hover:underline">Masuk di sini</button></>}
                 </p>
            </div>

            {error && <p className="bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                {isSignup && (
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="fullname">Nama Lengkap</label>
                        <input id="fullname" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary" />
                    </div>
                )}

                {!isForgotPassword && (
                  <>
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                            {isLogin && <button type="button" onClick={() => setMode('forgotPassword')} className="text-xs text-brand-secondary hover:underline">Lupa password?</button>}
                        </div>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary" />
                    </div>
                  </>
                )}

                {isForgotPassword && (
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="email-reset">Email</label>
                        <input id="email-reset" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary" />
                        <p className="text-xs text-gray-500 mt-2">Kami akan mengirimkan link untuk mereset password Anda ke email ini.</p>
                    </div>
                )}
                
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:opacity-50">
                    {loading ? <Spinner /> : (isLogin ? 'Masuk' : (isSignup ? 'Daftar' : 'Kirim Link Reset'))}
                </button>

                {isForgotPassword && <button type="button" onClick={() => setMode('login')} className="w-full mt-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Kembali ke Login</button>}
            </form>

            {!isForgotPassword && (
              <>
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500">ATAU</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:opacity-50">
                    <GoogleIcon />
                    Lanjutkan dengan Google
                </button>
              </>
            )}
        </>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Tutup"
        >
            <CloseIcon />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;
