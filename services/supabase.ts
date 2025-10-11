import { createClient } from '@supabase/supabase-js';

// Kredensial Supabase telah diisi sesuai yang Anda berikan.
const supabaseUrl = 'https://iqykverplkyzvfviiojj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeWt2ZXJwbGt5enZmdmlpb2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTA4MTQsImV4cCI6MjA3NTY4NjgxNH0.VXpxkGKMuQckxdwSSFc-vnE24Rbp-1Cl5FBuV4S-Zno';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Peringatan: Konfigurasi Supabase tidak lengkap. Silakan periksa kembali kredensial di services/supabase.ts");
}

// NOTE: Pastikan Anda telah menjalankan skrip SQL yang diberikan untuk menambahkan
// kolom 'is_admin' dan memperbarui kebijakan RLS (Row Level Security).

export const supabase = createClient(supabaseUrl, supabaseAnonKey);