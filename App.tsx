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
import FAQPage from './components/FAQPage';
import NotificationToast from './components/NotificationToast';
import TermsModal from './components/TermsModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import AuthPage from './components/AuthPage'; // Halaman login baru
import { useProfile } from './contexts/AuthContext'; // Konteks auth baru
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
  LiveryStyle,
} from './types';

import {
  PRODUCT_CATEGORIES,
  AD_STYLES,
  FASHION_AD_STYLES,
  AUTOMOTIVE_AD_STYLES,
  MODEL_GENDER_OPTIONS,
  AUTOMOTIVE_MODIFICATION_OPTIONS,
  MOTORCYCLE_MODIFICATION_OPTIONS,
  CAR_COLOR_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  COLOR_TONE_OPTIONS,
  VARIATION_OPTIONS,
  YES_NO_OPTIONS,
  LIVERY_STYLE_OPTIONS,
} from './constants';

type Page = 'landing' | 'category' | 'generator' | 'faq' | 'auth';

const App: React.FC = () => {
  const { profile, session, loading: authLoading } = useProfile();
  
  // App State
  const [page, setPage] = useState<Page>('landing');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  
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
  const [spoiler, setSpoiler] = useState<'yes' | 'no'>('no');
  const [wideBody, setWideBody] = useState<'yes' | 'no'>('no');
  const [rims, setRims] = useState<'yes' | 'no'>('no');
  const [hood, setHood] = useState<'yes' | 'no'>('no');
  const [allBumper, setAllBumper] = useState<'yes' | 'no'>('no');
  const [livery, setLivery] = useState<LiveryStyle>('none');
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [stickerPreview, setStickerPreview] = useState<string | null>(null);
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [personMode, setPersonMode] = useState<'full_body' | 'face_only'>('full_body');
  const [customModelFile, setCustomModelFile] = useState<File | null>(null);
  const [customModelPreview, setCustomModelPreview] = useState<string | null>(null);
  
  // Generation State
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLimitReached = useMemo(() => {
    if (!profile) return true; // Anggap limit tercapai jika tidak ada profil
    return profile.generation_count >= profile.generation_limit;
  }, [profile]);

  
  const resetGeneratorState = () => {
    setSelectedCategory(null);
    setImageFile(null);
    setUploadedImagePreview(null);
    setAdStyle('indoor_studio');
    setVariations(1);
    setGeneratedImages([]);
    setError(null);
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
    setAllBumper('no');
    setLivery('none');
    setStickerFile(null);
    setStickerPreview(null);
    setPersonImageFile(null);
    setPersonImagePreview(null);
    setPersonMode('full_body');
    setCustomModelFile(null);
    setCustomModelPreview(null);
  };

  const handleGoHome = () => {
    resetGeneratorState();
    setPage('landing');
  };

  const handleGoToFAQ = () => setPage('faq');
  const handleGoToAuth = () => setPage('auth');

  const handleStart = () => {
    if (session) {
      setPage('category');
    } else {
      setPage('auth');
    }
  };
  
  const handleSelectCategory = (category: ProductCategory) => {
    if (!session) {
        setPage('auth');
        return;
    }
    setSelectedCategory(category);
    setAdStyle('indoor_studio'); 
    setPage('generator');
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);
  };
  
  const handleCustomModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setCustomModelFile(file);
        setCustomModelPreview(URL.createObjectURL(file));
    } else {
        setCustomModelFile(null);
        setCustomModelPreview(null);
    }
  };

  const handleStickerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setStickerFile(file);
        setStickerPreview(URL.createObjectURL(file));
    } else {
        setStickerFile(null);
        setStickerPreview(null);
    }
  };

  const handlePersonImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setPersonImageFile(file);
        setPersonImagePreview(URL.createObjectURL(file));
    } else {
        setPersonImageFile(null);
        setPersonImagePreview(null);
    }
  };

  const handleGenerateClick = async () => {
    if (!imageFile || !selectedCategory || !profile) {
      setError('Silakan upload foto, pilih kategori, dan pastikan Anda sudah login.');
      return;
    }
    
    if (isLimitReached && !profile.is_paid) {
      setIsPaymentModalOpen(true);
      setError("Batas generate gratis Anda sudah habis. Silakan lakukan pembayaran untuk melanjutkan.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateAdPhotos(
        imageFile, selectedCategory, adStyle, variations, modelGender,
        automotiveModification, carColor, vehicleType, customPrompt,
        customCarColor, colorTone, spoiler, wideBody, rims, hood, allBumper,
        livery, stickerFile, personImageFile,
        personImageFile ? personMode : undefined,
        customModelFile
      );
      setGeneratedImages(images);
      
      // Update generation count in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ generation_count: profile.generation_count + 1 })
        .eq('id', profile.id);

      if (updateError) {
        console.error("Error updating generation count:", updateError);
        // Lanjutkan meski gagal update, agar user tetap dapat hasilnya
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryLabel = PRODUCT_CATEGORIES.find(c => c.value === selectedCategory)?.label || '';

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (page === 'auth' && !session) {
        return <AuthPage onAuthSuccess={() => setPage('category')} />;
    }

    // Jika user sudah login dan berada di halaman 'auth', redirect ke category
    if (page === 'auth' && session) {
        setPage('category');
        return null;
    }
    
    switch (page) {
      case 'landing':
        return <LandingPage onStart={handleStart} onGetAccess={() => setIsPaymentModalOpen(true)} />;
      case 'category':
        return <CategorySelectorPage onSelectCategory={handleSelectCategory} />;
      case 'faq':
        return <FAQPage />;
      case 'generator':
        if (!selectedCategory) {
          setPage('category');
          return null;
        }
        
        const gridColsClass = selectedCategory === 'automotive' ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
        const resultsColSpanClass = selectedCategory === 'automotive' ? 'lg:col-span-2' : 'lg:col-span-2';

        const GenerateButton = (
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !imageFile || (isLimitReached && !profile?.is_paid)}
              className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? ( <> <Spinner /> Membuat Gambar... </> ) : ( 'Generate Foto Iklan' )}
            </button>
        );

        return (
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
            <div className="mb-6 text-sm text-gray-500">
                <button onClick={() => setPage('category')} className="hover:text-brand-secondary">Pilih Kategori</button> &gt; <span>{selectedCategoryLabel}</span>
            </div>
            <div className={`grid grid-cols-1 ${gridColsClass} gap-8 items-start`}>
              
              <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <ImageUploader onImageUpload={handleImageUpload} uploadedImagePreview={uploadedImagePreview} />
                
                {selectedCategory === 'food_beverage' && (
                  <>
                    <OptionSelector title="2. Pilih Gaya Foto" options={AD_STYLES} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v)} />
                    <OptionSelector title="3. Pilih Tone Warna" options={COLOR_TONE_OPTIONS} selectedValue={colorTone} onValueChange={(v) => setColorTone(v)} />
                  </>
                )}
                
                {selectedCategory === 'fashion_lifestyle' && (
                  <>
                    <OptionSelector title="2. Pilih Gaya Foto" options={FASHION_AD_STYLES} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v)} />
                    <OptionSelector title="3. Pilih Model" options={MODEL_GENDER_OPTIONS} selectedValue={modelGender} onValueChange={(v) => setModelGender(v)} />
                    {modelGender === 'custom' && (
                        <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <label className="block text-sm font-semibold text-gray-700">Upload Foto Model</label>
                            <p className="text-xs text-gray-500 mb-2">Penting: Foto harus menampilkan seluruh badan (full body).</p>
                            <input type="file" onChange={handleCustomModelUpload} accept="image/png, image/jpeg" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100 w-full" />
                            {customModelPreview && <img src={customModelPreview} alt="Custom model preview" className="mt-2 h-24 w-auto object-contain rounded-md mx-auto bg-gray-100 p-1"/>}
                        </div>
                    )}
                  </>
                )}

                {selectedCategory === 'automotive' && (
                    <OptionSelector title="2. Pilih Gaya Foto" options={AUTOMOTIVE_AD_STYLES} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v)} />
                )}

                <OptionSelector title="4. Jumlah Variasi" options={VARIATION_OPTIONS} selectedValue={variations} onValueChange={(v) => setVariations(v)} />
                
                <div>
                  <label htmlFor="custom-prompt" className="block text-lg font-semibold mb-2 text-gray-800">5. Kustomisasi (Opsional)</label>
                  <textarea id="custom-prompt" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Contoh: tambahkan efek tertentu" className="w-full appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors" rows={3} />
                </div>
                
                {selectedCategory !== 'automotive' && GenerateButton}
              </div>

              <div className={`${resultsColSpanClass} space-y-8 ${selectedCategory === 'automotive' ? 'order-last lg:order-none' : ''}`}>
                 {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Terjadi Kesalahan</p>
                        <p>{error}</p>
                    </div>
                 )}

                {generatedImages.length > 0 ? (
                  <ImageGrid images={generatedImages} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md border border-gray-100 min-h-[400px]">
                    {isLoading ? (
                      <>
                        <Spinner />
                        <p className="mt-4 text-gray-600 font-semibold">AI sedang bekerja, mohon tunggu...</p>
                        <p className="mt-2 text-sm text-gray-500">Proses ini bisa memakan waktu hingga 1 menit.</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <h2 className="mt-4 text-xl font-bold text-gray-800">Hasil Foto Anda Akan Muncul di Sini</h2>
                        <p className="text-gray-500 mt-1">Lengkapi semua opsi dan baru klik "Generate".</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {selectedCategory === 'automotive' && (
                 <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Opsi Otomotif</h3>
                    <OptionSelector title="Tipe Kendaraan" options={VEHICLE_TYPE_OPTIONS} selectedValue={vehicleType} onValueChange={(v) => setVehicleType(v)} />
                    <OptionSelector title="Modifikasi" options={vehicleType === 'mobil' ? AUTOMOTIVE_MODIFICATION_OPTIONS : MOTORCYCLE_MODIFICATION_OPTIONS} selectedValue={automotiveModification} onValueChange={(v) => setAutomotiveModification(v)} />
                    
                    {automotiveModification === 'custom' && vehicleType === 'mobil' && (
                        <div className="space-y-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <OptionSelector title="Bumper & Sideskirt" options={YES_NO_OPTIONS} selectedValue={allBumper} onValueChange={(v) => setAllBumper(v)} />
                            <OptionSelector title="Spoiler" options={YES_NO_OPTIONS} selectedValue={spoiler} onValueChange={(v) => setSpoiler(v)} />
                            <OptionSelector title="Widebody" options={YES_NO_OPTIONS} selectedValue={wideBody} onValueChange={(v) => setWideBody(v)} />
                            <OptionSelector title="Velg Custom" options={YES_NO_OPTIONS} selectedValue={rims} onValueChange={(v) => setRims(v)} />
                            <OptionSelector title="Kap Mesin" options={YES_NO_OPTIONS} selectedValue={hood} onValueChange={(v) => setHood(v)} />
                            <OptionSelector title="Gaya Livery" options={LIVERY_STYLE_OPTIONS} selectedValue={livery} onValueChange={(v) => setLivery(v)} />
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Upload Stiker/Logo</label>
                                <input type="file" onChange={handleStickerUpload} accept="image/png, image/jpeg" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100"/>
                                {stickerPreview && <img src={stickerPreview} alt="sticker preview" className="mt-2 h-12 w-auto object-contain rounded-sm"/>}
                            </div>
                        </div>
                    )}

                    <OptionSelector title="Ubah Warna" options={CAR_COLOR_OPTIONS} selectedValue={carColor} onValueChange={(v) => setCarColor(v)} />
                    {carColor === 'custom' && (
                        <div className="pl-2">
                            <label htmlFor="custom-car-color" className="block text-sm font-medium mb-1 text-gray-700">Warna Custom:</label>
                            <input id="custom-car-color" type="text" value={customCarColor} onChange={(e) => setCustomCarColor(e.target.value)} placeholder="Contoh: bunglon (hijau ke ungu)" className="w-full text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50" />
                        </div>
                    )}
                     <div className="border-t pt-4 mt-4">
                        <h4 className="text-lg font-bold text-gray-800">Add People (Optional)</h4>
                        <input type="file" onChange={handlePersonImageUpload} accept="image/png, image/jpeg" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100 w-full" />
                        {personImagePreview && (
                            <div className="mt-4 space-y-3">
                                <img src={personImagePreview} alt="Person preview" className="h-24 w-auto object-contain rounded-md mx-auto bg-gray-100 p-1"/>
                                <OptionSelector title="Tipe Foto" options={[{ value: 'full_body', label: 'Full Body' }, { value: 'face_only', label: 'Wajah Saja' }]} selectedValue={personMode} onValueChange={(v) => setPersonMode(v as 'full_body' | 'face_only')} />
                                <p className="text-xs text-gray-500">{personMode === 'face_only' ? 'AI akan membuat badan yang sesuai.' : 'Pastikan foto menampilkan seluruh badan.'}</p>
                            </div>
                        )}
                    </div>
                    {GenerateButton}
                 </div>
              )}
            </div>
          </div>
        );
      default:
        return <LandingPage onStart={handleStart} onGetAccess={() => setIsPaymentModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header 
        onGoHome={handleGoHome} 
        onGoToFAQ={handleGoToFAQ}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyPolicyModalOpen(true)}
        onGoToAuth={handleGoToAuth}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer 
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyPolicyModalOpen(true)}
      />
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onSuccessfulPayment={() => {
            setIsPaymentModalOpen(false);
            // Logika untuk update profil jadi `is_paid` bisa ditambahkan di sini
        }}
      />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} onClose={() => setIsPrivacyPolicyModalOpen(false)} />
    </div>
  );
};

export default App;