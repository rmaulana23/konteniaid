import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

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
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: AuthError | null }>;
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
        let profileToSet = existingProfile as Profile;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Reset count for free users if it has been a month
        if (!profileToSet.is_paid && (!profileToSet.last_reset_at || new Date(profileToSet.last_reset_at) < oneMonthAgo)) {
          const updates = {
            generation_count: 0,
            last_reset_at: new Date().toISOString()
          };

          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', currentUser.id)
            .select()
            .single();

          if (updateError) {
            console.error("Failed to reset monthly generation count:", updateError);
          } else if (updatedProfile) {
            profileToSet = updatedProfile as Profile;
          }
        }
        setProfile(profileToSet);
      } else if (fetchError && fetchError.code === 'PGRST116') {
        const guestCount = parseInt(localStorage.getItem('guestGenerationCount') || '0', 10);
        const userMetadata = currentUser.user_metadata;
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            full_name: userMetadata.full_name || userMetadata.name,
            generation_limit: 3, // Default free limit for new users
            generation_count: guestCount, // Carry over guest usage
            last_reset_at: new Date().toISOString(), // Start the monthly timer
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          setProfile(null);
        } else {
          setProfile(newProfile as Profile);
          localStorage.removeItem('guestGenerationCount'); // Clean up guest data after transfer
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

  const signInWithEmail = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };
  
  const sendPasswordResetEmail = async (email: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.sendPasswordResetEmail(email, {
      redirectTo: window.location.origin,
    });
    return { error };
  };

  const value = {
    user,
    profile,
    setProfile,
    loading,
    login,
    logout,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordResetEmail,
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
