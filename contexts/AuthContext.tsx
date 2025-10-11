import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  is_paid: boolean;
  is_admin: boolean;
  generation_count: number;
  generation_limit: number;
  last_reset_at?: string | null; // Tambahkan field ini
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>; // Exposed setter
  session: Session | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        try {
          const currentUser = session?.user ?? null;

          if (currentUser) {
            // Pengguna memiliki sesi yang valid, sekarang kita HARUS mengambil profil mereka.
            const { data: userProfile, error } = await supabase
              .rpc('get_my_profile')
              .single();

            if (error || !userProfile) {
              // INI ADALAH BAGIAN PENTING: Jika profil gagal diambil, jangan biarkan pengguna dalam keadaan "setengah login".
              // Lakukan logout paksa untuk memastikan state aplikasi tetap konsisten.
              console.error("Gagal mengambil profil pengguna atau profil tidak ada. Melakukan logout paksa.", error);
              await supabase.auth.signOut();
              // Setelah signOut, listener ini akan dipanggil lagi dengan session null,
              // yang akan ditangani oleh blok 'else' di bawah untuk membersihkan state.
              // Kita hentikan eksekusi saat ini.
              return;
            }
            
            // HANYA JIKA profil berhasil diambil, kita set semua state login.
            setSession(session);
            setUser(currentUser);
            setProfile(userProfile as Profile);
          } else {
            // Jika tidak ada sesi atau pengguna, bersihkan semua state.
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error("Terjadi error tak terduga di onAuthStateChange, membersihkan sesi:", error);
          setSession(null);
          setUser(null);
          setProfile(null);
        } finally {
          // Pastikan loading selalu diatur ke false setelah proses selesai.
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    setProfile, // Provide setter to the context
    session,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};