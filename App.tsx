import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import ImageGrid from './components/ImageGrid';
import Spinner from './components/Spinner';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import PaymentModal from './components/PaymentModal';
import CategorySelectorPage from './components/CategorySelectorPage';
import Dashboard from './components/Dashboard'; // Import Dashboard
import ProgressBar from './components/ProgressBar';
import { useAuth } from './contexts/AuthContext';
import { generateAdPhotos } from './services/geminiService';
import { supabase } from './services/supabase';
import { PRODUCT_CATEGORIES, AD_STYLES, VARIATION_OPTIONS, FASHION_AD_STYLES, MODEL_GENDER_OPTIONS, AUTOMOTIVE_AD_STYLES, AUTOMOTIVE_MODIFICATION_OPTIONS, CAR_COLOR_OPTIONS, VEHICLE_TYPE_OPTIONS, COLOR_TONE_OPTIONS } from './constants';
import { ProductCategory, AdStyle, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone } from './types';

type View = 'landing' | 'category_selection' | 'tool' | 'dashboard'; // Tambahkan 'dashboard'

const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
);

const App: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Guest tracking now uses Supabase
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [guestGenerations, setGuestGenerations] = useState<number>(0);
  const [isTrialOver, setIsTrialOver] = useState(false);
  
  const GUEST_LIMIT = 3;

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [productCategory, setProductCategory] = useState<ProductCategory>('food_beverage');
  const [adStyle, setAdStyle] = useState<AdStyle>('indoor_studio');
  const [modelGender, setModelGender] = useState<ModelGender>('woman');
  const [vehicleType, setVehicleType] = useState<VehicleType>('mobil');
  const [automotiveModification, setAutomotiveModification] = useState<AutomotiveModification>('none');
  const [carColor, setCarColor] = useState<CarColor>('original');
  const [customCarColor, setCustomCarColor] = useState<string>('');
  const [colorTone, setColorTone] = useState<ColorTone>('natural');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [variations, setVariations] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem('deviceId');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('deviceId', id);
    }
    setDeviceId(id);

    const fetchGuestUsage = async (currentId: string) => {
        const { data } = await supabase
            .from('guest_usage')
            .select('generation_count')
            .eq('device_id', currentId)
            .single();
        
        setGuestGenerations(data?.generation_count || 0);
    };
    
    if (id && !user) { // Only fetch guest usage if not logged in
        fetchGuestUsage(id);
    }
  }, [user]);

  useEffect(() => {
    // Determine if the guest's trial is over
    if (!user && guestGenerations >= GUEST_LIMIT) {
        setIsTrialOver(true);
    } else {
        setIsTrialOver(false);
    }
  }, [user, guestGenerations]);

  const getAdStyleOptions = () => {
    switch (productCategory) {
      case 'fashion_lifestyle':
        return FASHION_AD_STYLES;
      case 'automotive':
        if (vehicleType === 'motor') {
            return AUTOMOTIVE_AD_STYLES.filter(style => style.value !== 'japanese_drifting');
        }
        return AUTOMOTIVE_AD_STYLES;
      default:
        return AD_STYLES;
    }
  };

  const adStyleOptions = getAdStyleOptions();
  const isFashionCategory = productCategory === 'fashion_lifestyle';
  const isAutomotiveCategory = productCategory === 'automotive';
  const isFoodCategory = productCategory === 'food_beverage';

  useEffect(() => {
    if (!adStyleOptions.some(opt => opt.value === adStyle)) {
      setAdStyle(adStyleOptions[0].value);
    }
  }, [productCategory, vehicleType, adStyle, adStyleOptions]);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setUploadedImagePreview(URL.createObjectURL(file));
    setError(null);
    setInfoMessage(null);
    setGeneratedImages([]);
  };

  const handleGetAccess = () => {
    setIsPaymentModalOpen(true);
  };
  
  const handleCategorySelect = (category: ProductCategory) => {
    setProductCategory(category);
    setCurrentView('tool');
  };
  
  const handleSuccessfulPayment = () => {
    setIsPaymentModalOpen(false);
    setError(null);
    setInfoMessage("Silakan kirim bukti transfer Anda via WhatsApp. Akses akan diaktifkan di akun Anda setelah pembayaran diverifikasi.");
  };

  const handleBackToCategorySelect = () => {
    setCurrentView('category_selection');
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setGeneratedImages([]);
    setError(null);
    setInfoMessage(null);
    setColorTone('natural');
  };

  const resetToolState = () => {
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setProductCategory('food_beverage');
    setAdStyle('indoor_studio');
    setModelGender('woman');
    setVehicleType('mobil');
    setAutomotiveModification('none');
    setCarColor('original');
    setCustomCarColor('');
    setColorTone('natural');
    setCustomPrompt('');
    setVariations(1);
    setGeneratedImages([]);
    setError(null);
    setInfoMessage(null);
  };

  const handleGoHome = () => {
    setCurrentView('landing');
    resetToolState();
  };
  
  const handleGoDashboard = () => {
      if(profile?.is_admin) {
        setCurrentView('dashboard');
        resetToolState();
      }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Silakan upload foto produk terlebih dahulu.');
      return;
    }

    setInfoMessage(null);
    setError(null);

    // Cek kuota pengguna yang sudah login
    if (user && profile) {
        if (!profile.is_paid && profile.generation_count >= profile.generation_limit) { // FIX: Menggunakan is_paid
            setError('Batas percobaan gratis Anda telah habis. Silakan selesaikan pembayaran untuk melanjutkan.');
            setIsPaymentModalOpen(true);
            return;
        }
        if (profile.is_paid && profile.generation_count >= profile.generation_limit) { // FIX: Menggunakan is_paid
            setError('Anda telah mencapai batas maksimum generasi untuk saat ini.');
            return;
        }
    }
    
    // Cek kuota tamu
    if (isTrialOver) {
        setError('Batas percobaan gratis Anda telah habis. Silakan login atau lakukan pembayaran untuk melanjutkan.');
        setIsPaymentModalOpen(true);
        return;
    }

    setIsLoading(true);
    setGeneratedImages([]);

    try {
      const images = await generateAdPhotos(
          uploadedImage, productCategory, adStyle, variations, 
          isFashionCategory ? modelGender : undefined,
          isAutomotiveCategory ? automotiveModification : undefined,
          isAutomotiveCategory ? carColor : undefined,
          isAutomotiveCategory ? vehicleType : undefined,
          customPrompt,
          isAutomotiveCategory && carColor === 'custom' ? customCarColor : undefined,
          isFoodCategory ? colorTone : undefined
      );
      setGeneratedImages(images);
      
      if (user && profile) {
          // Update hitungan untuk pengguna yang login
          const newCount = profile.generation_count + 1;
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ generation_count: newCount })
            .eq('id', user.id);
          if (updateError) console.error('Gagal update hitungan pengguna:', updateError);
          // Refresh profile data locally might be needed here, but auth context handles it on next load
      } else if (deviceId) {
        // Update hitungan untuk tamu
        const newCount = guestGenerations + 1;
        const { error: upsertError } = await supabase
          .from('guest_usage')
          .upsert({ device_id: deviceId, generation_count: newCount });

        if (upsertError) console.error('Gagal update penggunaan tamu:', upsertError);
        setGuestGenerations(newCount);
        
        if (newCount >= GUEST_LIMIT) {
           setError('Batas percobaan gratis Anda telah habis. Untuk generate selanjutnya, silakan login atau lakukan pembayaran.');
        }
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepNumber = (step: 'style' | 'vehicle' | 'mod' | 'color' | 'model' | 'color_tone' | 'custom' | 'variation') => {
    // Step 1 is always Upload, so we start numbering from 2
    if (isAutomotiveCategory) {
      switch (step) {
        case 'vehicle': return 2; case 'style': return 3; case 'mod': return 4; case 'color': return 5; case 'custom': return 6; case 'variation': return 7;
      }
    }
    if (isFashionCategory) {
      switch (step) {
        case 'style': return 2; case 'model': return 3; case 'custom': return 4; case 'variation': return 5;
      }
    }
    // Food category is the default
    switch (step) {
        case 'style': return 2; case 'color_tone': return 3; case 'custom': return 4; case 'variation': return 5;
    }
    return 0;
  };

  const isGenerateDisabled = isLoading || !uploadedImage;
  
  if (loading) {
    return (
        <div className="min-h-screen flex flex-col bg-brand-background">
            <Header onGoHome={handleGoHome} onGoDashboard={handleGoDashboard} />
            <div className="flex-grow flex items-center justify-center">
                 <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md min-h-[400px] border border-gray-200">
                    <svg className="animate-spin h-10 w-10 text-brand-secondary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-gray-700 font-semibold">Memuat Sesi...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
  }

  const renderView = () => {
    switch(currentView) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentView('category_selection')} onGetAccess={handleGetAccess} />;
      case 'category_selection':
        return <CategorySelectorPage onSelectCategory={handleCategorySelect} />;
      case 'dashboard':
        // Melindungi route dashboard
        return profile?.is_admin ? <Dashboard /> : <LandingPage onStart={() => setCurrentView('category_selection')} onGetAccess={handleGetAccess} />;
      case 'tool':
        return (
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-md h-fit border border-gray-200">
                <div className="space-y-5">
                   <button 
                    onClick={handleBackToCategorySelect} 
                    className="w-full text-sm text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 bg-gray-100 hover:bg-gray-200"
                   >
                      <BackIcon /> Ganti Kategori
                   </button>
                  <ImageUploader onImageUpload={handleImageUpload} uploadedImagePreview={uploadedImagePreview} />
                  {isAutomotiveCategory && (<OptionSelector title={`${getStepNumber('vehicle')}. Pilih Jenis Kendaraan`} options={VEHICLE_TYPE_OPTIONS} selectedValue={vehicleType} onValueChange={(value) => setVehicleType(value as VehicleType)} />)}
                  <OptionSelector title={`${getStepNumber('style')}. Pilih Gaya Iklan`} options={adStyleOptions} selectedValue={adStyle} onValueChange={(value) => setAdStyle(value as AdStyle)} />
                  {isFoodCategory && (<OptionSelector title={`${getStepNumber('color_tone')}. Pilih Color Tone`} options={COLOR_TONE_OPTIONS} selectedValue={colorTone} onValueChange={(value) => setColorTone(value as ColorTone)} />)}
                  {isAutomotiveCategory && (
                    <>
                        <OptionSelector title={`${getStepNumber('mod')}. Pilih Modifikasi (Special)`} options={AUTOMOTIVE_MODIFICATION_OPTIONS} selectedValue={automotiveModification} onValueChange={(value) => setAutomotiveModification(value as AutomotiveModification)} />
                        <OptionSelector title={`${getStepNumber('color')}. Pilih Warna`} options={CAR_COLOR_OPTIONS} selectedValue={carColor} onValueChange={(value) => setCarColor(value as CarColor)} />
                        {carColor === 'custom' && (
                          <div className="w-full -mt-3">
                              <input type="text" value={customCarColor} onChange={(e) => setCustomCarColor(e.target.value)} placeholder="Contoh: bunglon 3 warna, hijau tosca" className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors" aria-label="Custom Car Color Input" />
                          </div>
                        )}
                    </>
                  )}
                  {isFashionCategory && (<OptionSelector title={`${getStepNumber('model')}. Pilih Model`} options={MODEL_GENDER_OPTIONS} selectedValue={modelGender} onValueChange={(value) => setModelGender(value as ModelGender)} />)}
                  <div className="w-full">
                      <label htmlFor="custom-prompt" className="block text-lg font-semibold mb-2 text-gray-800">{getStepNumber('custom')}. Custom Prompt (Opsional)</label>
                      <textarea id="custom-prompt" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="tambahkan efek tertentu" className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors" rows={3} aria-label="Custom Prompt (Opsional)" />
                  </div>
                  <OptionSelector title={`${getStepNumber('variation')}. Jumlah Variasi`} options={VARIATION_OPTIONS} selectedValue={variations} onValueChange={(value) => setVariations(value as number)} />
                  {user && profile && (
                    <div className="w-full">
                      <p className="text-center text-sm text-gray-600 mb-1">Kuota Tersisa:</p>
                      <ProgressBar value={profile.generation_count} limit={profile.generation_limit} />
                    </div>
                  )}
                  {!user && (
                      <div className="text-center text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
                          Sisa percobaan gratis: <strong>{Math.max(0, GUEST_LIMIT - guestGenerations)}</strong>
                      </div>
                  )}
                  <button onClick={handleGenerate} disabled={isGenerateDisabled} className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isLoading ? <Spinner /> : 'Generate Ad Photo'}
                  </button>
                  {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
                  {infoMessage && <p className="text-green-600 text-sm mt-2 text-center">{infoMessage}</p>}
                </div>
              </div>
              <div className="lg:col-span-2">
                {isLoading && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md min-h-[400px] border border-gray-200">
                      <svg className="animate-spin h-10 w-10 text-brand-secondary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <p className="text-gray-700 font-semibold">AI sedang bekerja... </p>
                      <p className="text-gray-500 text-sm">Proses ini bisa memakan waktu hingga 1 menit.</p>
                  </div>
                )}
                {!isLoading && generatedImages.length > 0 && (<ImageGrid images={generatedImages} />)}
                {!isLoading && generatedImages.length === 0 && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md text-center min-h-[400px] border border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <h3 className="text-xl font-semibold text-gray-700">Hasil Anda Akan Muncul di Sini</h3>
                        <p className="text-gray-500 mt-1">Upload foto dan atur pilihan Anda untuk memulai.</p>
                    </div>
                )}
              </div>
            </div>
          </main>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header onGoHome={handleGoHome} onGoDashboard={handleGoDashboard} isTrialOver={isTrialOver} />
      {renderView()}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccessfulPayment={handleSuccessfulPayment}
        isBlocking={isTrialOver}
      />
      <Footer />
    </div>
  );
};

export default App;