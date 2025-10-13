import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../services/supabase';

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

interface ProfileContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrCreateProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (existingProfile) {
          setProfile(existingProfile as Profile);
        } else if (fetchError && fetchError.code === 'PGRST116') { // PGRST116: row not found
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              full_name: user.fullName,
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
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      getOrCreateProfile();
    }
  }, [user, isLoaded]);

  const value = {
    profile,
    setProfile,
    loading,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
