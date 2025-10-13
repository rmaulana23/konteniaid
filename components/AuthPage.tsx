import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Spinner from './Spinner';

interface AuthPageProps {
    onAuthSuccess: () => void;
}

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.67.111 2.458.322m4.896 9.074A10.02 10.02 0 0112 19c-1.63 0-3.17-.48-4.5-1.325m-3.15-3.812A10.02 10.02 0 012.458 12c.42-.993 1.01-1.92 1.7-2.75M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>;

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const [view, setView] = useState<'sign_in' | 'sign_up' | 'forgot_password'>('sign_in');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (view === 'sign_in') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onAuthSuccess();
            } else if (view === 'sign_up') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName }
                    }
                });
                if (error) throw error;
                setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
            } else if (view === 'forgot_password') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
                setMessage('Email untuk reset password telah dikirim. Silakan cek inbox Anda.');
            }
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => {
        if (view === 'forgot_password') {
            return (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password</h2>
                    <p className="text-gray-600 mb-6">Masukkan email Anda untuk menerima link reset password.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {view === 'sign_in' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
                </h2>
                <div className="space-y-4">
                    {view === 'sign_up' && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white text-gray-900 p-8 rounded-lg shadow-lg border border-gray-100">
                <form onSubmit={handleAuthAction}>
                    {renderForm()}

                    {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
                    {message && <p className="mt-4 text-sm text-green-600 bg-green-50 p-2 rounded-md">{message}</p>}

                    <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? <Spinner /> : (view === 'sign_in' ? 'Masuk' : view === 'sign_up' ? 'Daftar' : 'Kirim Link Reset')}
                    </button>
                </form>

                <div className="mt-6 text-sm text-center">
                    {view === 'sign_in' && (
                        <>
                            <p>Belum punya akun? <button onClick={() => { setView('sign_up'); setError(null); }} className="font-medium text-brand-primary hover:underline">Daftar</button></p>
                            <p className="mt-2"><button onClick={() => { setView('forgot_password'); setError(null); }} className="font-medium text-brand-primary hover:underline">Lupa password?</button></p>
                        </>
                    )}
                    {view === 'sign_up' && (
                        <p>Sudah punya akun? <button onClick={() => { setView('sign_in'); setError(null); }} className="font-medium text-brand-primary hover:underline">Masuk</button></p>
                    )}
                    {view === 'forgot_password' && (
                        <p>Ingat password? <button onClick={() => { setView('sign_in'); setError(null); }} className="font-medium text-brand-primary hover:underline">Kembali ke halaman Masuk</button></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;