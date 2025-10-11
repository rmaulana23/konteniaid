import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Profile } from '../contexts/AuthContext';
import ProgressBar from './ProgressBar';

// Komponen Toggle Switch yang stylish
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
  </label>
);

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('email', { ascending: true });

      if (error) {
        setError('Gagal memuat data pengguna: ' + error.message);
        console.error(error);
      } else {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  const handlePaymentStatusChange = async (profileId: string, newStatus: boolean) => {
    // Update state secara optimis untuk UX yang lebih responsif
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === profileId ? { ...p, paid_status: newStatus } : p
      )
    );

    const { error } = await supabase
      .from('profiles')
      .update({ paid_status: newStatus })
      .eq('id', profileId);

    if (error) {
      // Jika gagal, kembalikan state ke semula dan tampilkan error
      setError(`Gagal memperbarui status untuk pengguna ${profileId}.`);
      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.id === profileId ? { ...p, paid_status: !newStatus } : p
        )
      );
    }
  };
  
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <svg className="animate-spin h-10 w-10 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;
  }

  return (
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-800 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">Pengguna</th>
              <th scope="col" className="px-6 py-3">Progres Generate</th>
              <th scope="col" className="px-6 py-3 text-center">Sudah Bayar</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {profile.email || 'No Email'}
                </td>
                <td className="px-6 py-4">
                  <ProgressBar value={profile.generation_count} limit={profile.generation_limit} />
                </td>
                <td className="px-6 py-4 text-center">
                   <ToggleSwitch 
                        checked={profile.paid_status}
                        onChange={() => handlePaymentStatusChange(profile.id, !profile.paid_status)}
                        disabled={profile.is_admin} // Admin tidak bisa mengubah statusnya sendiri
                   />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Dashboard;