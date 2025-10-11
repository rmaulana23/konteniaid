import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import CategorySelectorPage from './components/CategorySelectorPage';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import ImageGrid from './components/ImageGrid';
import Spinner from './components/Spinner';
import PaymentModal from './components/PaymentModal';
import Dashboard from './components/Dashboard';

import { useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';
import { generateAdPhotos } from './services/geminiService';

import {
  ProductCategory,
  AdStyle,
  ModelGender,
  AutomotiveModification,
  CarColor,
  VehicleType,
  ColorTone,
} from './types';

import {
  PRODUCT_CATEGORIES,
  AD_STYLES,
  FASHION_AD_STYLES,
  AUTOMOTIVE_AD_STYLES,
  MODEL_GENDER_OPTIONS,
  AUTOMOTIVE_MODIFICATION_OPTIONS,
  CAR_COLOR_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  COLOR_TONE_OPTIONS,
  VARIATION_OPTIONS,
  YES_NO_OPTIONS,
} from './constants';

type Page = 'landing' | 'category' | 'generator' | 'dashboard';

const App: React.FC = () => {
  const { user, profile, setProfile, login, loading: authLoading } = useAuth();

  // App State
  const [page, setPage] = useState<Page>('landing');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Form State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [adStyle, setAdStyle] = useState<AdStyle>('indoor_studio');
  const [variations, setVariations] = useState<number>(1);
  const [modelGender, setModelGender] = useState<ModelGender>('woman');
  const [automotiveModification, setAutomotiveModification] = useState<AutomotiveModification>('none');
  const [carColor, setCarColor] = useState<CarColor>('original');
  const [vehicleType, setVehicleType] = useState<VehicleType>('mobil');
  const [colorTone, setColorTone] = useState<ColorTone>('natural');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customCarColor, setCustomCarColor] = useState('');

  // Custom Automotive Mod State
  const [spoiler, setSpoiler] = useState<'yes' | 'no'>('no');
  const [wideBody, setWideBody] = useState<'yes' | 'no'>('no');
  const [rims, setRims] = useState<'yes' | 'no'>('no');
  const [hood, setHood] = useState<'yes' | 'no'>('no');


  // Generation State
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTrialOver = useMemo(() => {
    if (!profile) return false;
    return !profile.is_paid && profile.generation_count >= profile.generation_limit;
  }, [profile]);

  useEffect(() => {
    if (authLoading) return;
    if (user && profile) {
      if (page === 'landing') {
        setPage('category');
      }
    } else {
      setPage('landing');
      resetGeneratorState();
    }
  }, [user, profile, authLoading, page]);
  
  const resetGeneratorState = () => {
    setSelectedCategory(null);
    setImageFile(null);
    setUploadedImagePreview(null);
    setAdStyle('indoor_studio');
    setVariations(1);
    setGeneratedImages([]);
    setError(null);
    // Reset category-specific states
    setModelGender('woman');
    setAutomotiveModification('none');
    setCarColor('original');
    setVehicleType('mobil');
    setColorTone('natural');
    setCustomPrompt('');
    setCustomCarColor('');
    setSpoiler('no');
    setWideBody('no');
    setRims('no');
    setHood('no');
  };

  const handleGoHome = () => {
    resetGeneratorState();
    setPage('category');
  };

  const handleStart = () => {
    if (user) {
      setPage('category');
    } else {
      login();
    }
  };
  
  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    // Reset style to a default valid for all, then let specific logic handle it
    setAdStyle('indoor_studio'); 
    setPage('generator');
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);
  };

  const handleGenerateClick = async () => {
    if (!imageFile || !selectedCategory) {
      setError('Silakan upload foto produk dan pilih kategori terlebih dahulu.');
      return;
    }

    // Blokir generasi jika batas uji coba gratis terlampaui.
    if (profile && !profile.is_paid) {
      const remainingGenerations = profile.generation_limit - profile.generation_count;

      // Kasus 1: Pengguna sama sekali tidak punya sisa generasi.
      if (remainingGenerations <= 0) {
        setError('Sisa generate gratis Anda sudah habis. Silakan upgrade untuk melanjutkan.');
        setIsPaymentModalOpen(true);
        return;
      }

      // Kasus 2: Pengguna mencoba membuat lebih banyak variasi daripada sisa kuota gratis mereka.
      if (variations > remainingGenerations) {
        setError(`Gagal. Anda mencoba membuat ${variations} variasi, tetapi sisa jatah gratis Anda hanya ${remainingGenerations}. Silakan kurangi jumlah variasi atau upgrade.`);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const newImages = await generateAdPhotos(
        imageFile,
        selectedCategory,
        adStyle,
        variations,
        modelGender,
        automotiveModification,
        carColor,
        vehicleType,
        customPrompt,
        customCarColor,
        colorTone,
        spoiler,
        wideBody,
        rims,
        hood
      );
      setGeneratedImages(newImages);

      // Update generation count
      if (profile && !profile.is_admin) {
        const newCount = profile.generation_count + variations;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ generation_count: newCount })
          .eq('id', profile.id);

        if (updateError) {
          console.error("Failed to update generation count:", updateError);
          // Don't block user, but log it
        } else {
          // Optimistically update local profile state
          setProfile({ ...profile, generation_count: newCount });
        }
      }
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const adStyleOptions = useMemo(() => {
    switch (selectedCategory) {
      case 'fashion_lifestyle': return FASHION_AD_STYLES;
      case 'automotive': return AUTOMOTIVE_AD_STYLES;
      case 'food_beverage': return AD_STYLES;
      default: return [];
    }
  }, [selectedCategory]);

  useEffect(() => {
      if (adStyleOptions.length > 0 && !adStyleOptions.find(opt => opt.value === adStyle)) {
          setAdStyle(adStyleOptions[0].value);
      }
  }, [adStyle, adStyleOptions]);

  const renderGeneratorForm = () => {
    if (!selectedCategory) return null;

    const categoryInfo = PRODUCT_CATEGORIES.find(c => c.value === selectedCategory);

    return (
      <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
        <button
          onClick={() => {
            resetGeneratorState();
            setPage('category');
          }}
          className="text-sm font-semibold text-brand-secondary hover:text-brand-primary mb-6 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Kembali & Ganti Kategori
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Foto Iklan untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-500">{categoryInfo?.label}</span></h1>
        <p className="text-gray-600 mb-8">Upload foto produk Anda dan pilih opsi di bawah untuk memulai.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Options */}
          <div className="lg:col-span-1 space-y-6 bg-gray-50 p-6 rounded-lg border">
            <ImageUploader onImageUpload={handleImageUpload} uploadedImagePreview={uploadedImagePreview} />
            
            <OptionSelector title="2. Pilih Gaya Iklan" options={adStyleOptions} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v as AdStyle)} />

            {selectedCategory === 'fashion_lifestyle' && (
              <OptionSelector title="Pilih Model" options={MODEL_GENDER_OPTIONS} selectedValue={modelGender} onValueChange={(v) => setModelGender(v as ModelGender)} />
            )}

            {selectedCategory === 'automotive' && (
              <>
                <OptionSelector title="Jenis Kendaraan" options={VEHICLE_TYPE_OPTIONS} selectedValue={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)} />
                <OptionSelector title="Pilih Modifikasi" options={AUTOMOTIVE_MODIFICATION_OPTIONS} selectedValue={automotiveModification} onValueChange={(v) => setAutomotiveModification(v as AutomotiveModification)} />
                
                {vehicleType === 'mobil' && automotiveModification === 'custom' && (
                    <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-gray-800 -mb-2">Detail Modifikasi Custom:</h4>
                        <OptionSelector title="Spoiler" options={YES_NO_OPTIONS} selectedValue={spoiler} onValueChange={(v) => setSpoiler(v as 'yes' | 'no')} />
                        <OptionSelector title="Wide Body" options={YES_NO_OPTIONS} selectedValue={wideBody} onValueChange={(v) => setWideBody(v as 'yes' | 'no')} />
                        <OptionSelector title="Rims/Velg" options={YES_NO_OPTIONS} selectedValue={rims} onValueChange={(v) => setRims(v as 'yes' | 'no')} />
                        <OptionSelector title="Hood" options={YES_NO_OPTIONS} selectedValue={hood} onValueChange={(v) => setHood(v as 'yes' | 'no')} />
                    </div>
                )}

                <OptionSelector title="Ubah Warna" options={CAR_COLOR_OPTIONS} selectedValue={carColor} onValueChange={(v) => setCarColor(v as CarColor)} />
                {carColor === 'custom' && (
                    <div>
                        <label htmlFor="custom-car-color" className="block text-sm font-medium text-gray-700 mb-1">Tulis Warna Custom</label>
                        <input
                            type="text"
                            id="custom-car-color"
                            value={customCarColor}
                            onChange={(e) => setCustomCarColor(e.target.value)}
                            className="w-full bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50"
                            placeholder="e.g., bunglon ungu-hijau"
                        />
                    </div>
                )}
              </>
            )}

            {selectedCategory === 'food_beverage' && (
                <OptionSelector title="Pilih Tone Warna" options={COLOR_TONE_OPTIONS} selectedValue={colorTone} onValueChange={(v) => setColorTone(v as ColorTone)} />
            )}

            <OptionSelector title="3. Jumlah Variasi" options={VARIATION_OPTIONS} selectedValue={variations} onValueChange={(v) => setVariations(v as number)} />

             <div>
                <label htmlFor="custom-prompt" className="block text-lg font-semibold mb-2 text-gray-800">4. (Opsional) Instruksi Tambahan</label>
                <textarea
                    id="custom-prompt"
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors"
                    placeholder="Contoh: tambahkan latar belakang pantai"
                />
             </div>

            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !imageFile || isTrialOver}
              className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Membuat Foto...
                </>
              ) : (
                'Generate Foto Iklan'
              )}
            </button>
            {isTrialOver && <p className="text-center text-sm text-red-600 mt-2">Sisa generate gratis Anda habis. Silakan upgrade untuk melanjutkan.</p>}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border h-full min-h-[300px]">
                <Spinner />
                <p className="mt-4 text-gray-700 font-semibold">AI sedang bekerja, mohon tunggu...</p>
                <p className="mt-1 text-sm text-gray-500">Proses ini bisa memakan waktu hingga 1 menit.</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
                <p className="font-semibold">Oops, terjadi kesalahan!</p>
                <p>{error}</p>
              </div>
            )}
            {!isLoading && generatedImages.length > 0 && <ImageGrid images={generatedImages} />}
            {!isLoading && generatedImages.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed h-full min-h-[300px]">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="mt-4 text-gray-500 font-semibold">Hasil foto iklan Anda akan muncul di sini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderPage = () => {
    if (authLoading) {
      return (
        <div className="flex-grow flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      );
    }
    
    switch (page) {
      case 'dashboard':
        return profile?.is_admin ? <Dashboard /> : <CategorySelectorPage onSelectCategory={handleSelectCategory} />;
      case 'generator':
        return renderGeneratorForm();
      case 'category':
        return <CategorySelectorPage onSelectCategory={handleSelectCategory} />;
      case 'landing':
      default:
        return <LandingPage onStart={handleStart} onGetAccess={() => setIsPaymentModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-background font-sans">
      <Header 
        onGoHome={handleGoHome} 
        onGoDashboard={() => setPage('dashboard')} 
        onUpgradeClick={() => setIsPaymentModalOpen(true)}
        isTrialOver={isTrialOver}
      />
      {renderPage()}
      <Footer />
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccessfulPayment={() => {
            // This is optimistic. It doesn't mean payment is confirmed,
            // just that the user has been sent to WhatsApp.
            // We can show a confirmation message.
            setIsPaymentModalOpen(false);
            // Optionally redirect or show a "waiting for confirmation" message.
        }}
        isBlocking={isTrialOver && page === 'generator'} // Block closing if trial is over on generator page
      />
    </div>
  );
};

export default App;
