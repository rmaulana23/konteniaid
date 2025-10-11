import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  paid_status: boolean;
  is_admin: boolean; // Menambahkan status admin
  generation_count: number;
  generation_limit: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
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
    // Logika disederhanakan: onAuthStateChange menangani semua kasus,
    // termasuk pemuatan sesi awal (INITIAL_SESSION event).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            setProfile(userProfile);
        } else {
            setProfile(null);
        }
        
        // FIX UTAMA: Atur loading ke false SETELAH semua data sesi dan profil selesai diproses.
        setLoading(false);
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
        // Tambahkan queryParams untuk selalu menampilkan pilihan akun
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
