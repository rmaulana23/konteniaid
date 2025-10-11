import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import type { Profile } from '../contexts/AuthContext';
import ProgressBar from './ProgressBar';

// Komponen Toggle Switch
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only peer" />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
  </label>
);

// Komponen Ikon untuk Kartu Statistik
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const PaidUserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GenerationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

// Komponen Kartu Statistik
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center gap-4">
    <div className="bg-blue-100 text-brand-primary p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    // Optimistically update UI
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === profileId ? { ...p, is_paid: newStatus } : p // FIX: Menggunakan is_paid
      )
    );

    // Update database
    const { error } = await supabase
      .from('profiles')
      .update({ is_paid: newStatus }) // FIX: Menggunakan is_paid
      .eq('id', profileId);

    if (error) {
      setError(`Gagal memperbarui status untuk pengguna ${profileId}.`);
      // Revert UI on error
      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.id === profileId ? { ...p, is_paid: !newStatus } : p // FIX: Menggunakan is_paid
        )
      );
    }
  };
  
  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return profiles;
    return profiles.filter(profile =>
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [profiles, searchTerm]);

  const totalUsers = profiles.length;
  const paidUsers = profiles.filter(p => p.is_paid).length; // FIX: Menggunakan is_paid
  const totalGenerations = profiles.reduce((sum, p) => sum + p.generation_count, 0);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <svg className="animate-spin h-10 w-10 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Kelola pengguna dan pantau aktivitas aplikasi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Pengguna" value={totalUsers} icon={<UsersIcon />} />
        <StatCard title="Pengguna Berbayar" value={paidUsers} icon={<PaidUserIcon />} />
        <StatCard title="Total Generasi" value={totalGenerations} icon={<GenerationIcon />} />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Manajemen Pengguna</h2>
            <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Cari pengguna via email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-800 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-3">Pengguna</th>
                <th scope="col" className="px-6 py-3">Progres Generate</th>
                <th scope="col" className="px-6 py-3 text-center">Sudah Bayar</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length > 0 ? filteredProfiles.map(profile => (
                <tr key={profile.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="font-bold">{profile.full_name || 'No Name'}</div>
                    <div className="text-xs text-gray-500">{profile.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <ProgressBar value={profile.generation_count} limit={profile.generation_limit} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ToggleSwitch 
                          checked={profile.is_paid} // FIX: Menggunakan is_paid
                          onChange={() => handlePaymentStatusChange(profile.id, !profile.is_paid)} // FIX: Menggunakan is_paid
                          disabled={profile.is_admin}
                    />
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">
                        Tidak ada pengguna yang cocok dengan pencarian Anda.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;