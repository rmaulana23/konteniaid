import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  is_paid: boolean;
  is_admin: boolean;
  generation_count: number;
  generation_limit: number;
  last_reset_at?: string | null;
}

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange menangani semuanya: sesi awal, login, logout.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchAndSetProfile(currentUser);
      } else {
        setProfile(null);
      }
      
      // Hentikan loading hanya setelah pemeriksaan auth pertama selesai.
      setLoading(false); 
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchAndSetProfile = async (currentUser: User) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (existingProfile) {
        setProfile(existingProfile as Profile);
      } else if (fetchError && fetchError.code === 'PGRST116') {
        const userMetadata = currentUser.user_metadata;
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            full_name: userMetadata.full_name || userMetadata.name,
            generation_limit: 5, // Default free limit
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          setProfile(null);
        } else {
          setProfile(newProfile as Profile);
        }
      } else if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        setProfile(null);
      }
    } catch (error) {
      console.error("An unexpected error occurred while fetching or creating profile:", error);
      setProfile(null);
    }
  };
  
  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        },
    });
    if (error) console.error("Error logging in:", error.message);
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    if (error) console.error("Error logging out:", error.message);
  };

  const value = {
    user,
    profile,
    setProfile,
    loading,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
