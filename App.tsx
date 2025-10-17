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
import AccessCodeModal from './components/AccessCodeModal';
import FAQPage from './components/FAQPage';
import NotificationToast from './components/NotificationToast'; // Import the new toast component
import TermsModal from './components/TermsModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';

import { supabase } from './services/supabase';
import { generateAdPhotos } from './services/geminiService';

import {
  ProductCategory,
  AdStyle,
  ModelGender,
  ModelEthnicity,
  AutomotiveModification,
  CarColor,
  VehicleType,
  ColorTone,
  LiveryStyle,
  PhotoFormat,
  AestheticStyle,
  ObjectStyle,
} from './types';

import {
  PRODUCT_CATEGORIES,
  LEVITATING_FOOD_AD_STYLES,
  FASHION_AD_STYLES,
  AUTOMOTIVE_AD_STYLES,
  MODEL_GENDER_OPTIONS,
  MODEL_ETHNICITY_OPTIONS,
  AUTOMOTIVE_MODIFICATION_OPTIONS,
  MOTORCYCLE_MODIFICATION_OPTIONS,
  CAR_COLOR_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  COLOR_TONE_OPTIONS,
  VARIATION_OPTIONS,
  YES_NO_OPTIONS,
  LIVERY_STYLE_OPTIONS,
  AESTHETIC_STYLE_OPTIONS,
  OBJECT_STYLE_OPTIONS,
} from './constants';

type Page = 'landing' | 'category' | 'generator' | 'faq';

const GUEST_GENERATION_LIMIT = 3;

// Fungsi untuk membuat ID perangkat yang lebih kuat menggunakan Canvas Fingerprinting
const getSimpleDeviceId = async (): Promise<string> => {
    // Helper untuk canvas fingerprinting
    const getCanvasFingerprint = (): string => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return 'no-canvas-context';

            // Gambar beberapa elemen unik untuk menghasilkan fingerprint
            const text = 'Kontenia.id_donottrytohackme<@~`!?-/\\|>';
            ctx.textBaseline = 'top';
            ctx.font = '14px "Arial"';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText(text, 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText(text, 4, 17);

            return canvas.toDataURL();
        } catch (e) {
            console.error("Canvas fingerprinting failed:", e);
            return 'canvas-fingerprint-error';
        }
    };

    const { language, hardwareConcurrency } = navigator;
    const screenResolution = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timezoneOffset = new Date().getTimezoneOffset();
    const canvasFingerprint = getCanvasFingerprint();

    // Identifier baru tidak lagi menggunakan userAgent, sehingga lebih konsisten antar browser
    const identifier = `${canvasFingerprint}${screenResolution}${hardwareConcurrency}${timezoneOffset}${language}`;

    // Fungsi hash sederhana (djb2)
    let hash = 5381;
    for (let i = 0; i < identifier.length; i++) {
        hash = (hash * 33) ^ identifier.charCodeAt(i);
    }
    return String(hash >>> 0); // Pastikan integer positif
};


const App: React.FC = () => {
  // App State
  const [page, setPage] = useState<Page>('landing');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isAccessCodeModalOpen, setIsAccessCodeModalOpen] = useState(false);
  const [showTrialToast, setShowTrialToast] = useState(false); // State for the new notification
  
  // Guest State with Device ID
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [guestGenerationCount, setGuestGenerationCount] = useState<number>(0);
  const [hasValidAccessCode, setHasValidAccessCode] = useState<boolean>(false);
  const [pendingCategory, setPendingCategory] = useState<ProductCategory | null>(null);

  // Initialize Device ID and load guest data from Supabase for persistence
  useEffect(() => {
    const initDevice = async () => {
        const id = await getSimpleDeviceId();
        setDeviceId(id);

        if (id) {
            try {
                // Check if device already exists in Supabase
                const { data, error } = await supabase
                    .from('guest_devices')
                    .select('generation_count, has_access_code')
                    .eq('device_id', id)
                    .single();

                if (data) {
                    // Device exists, use its data
                    setGuestGenerationCount(data.generation_count);
                    setHasValidAccessCode(data.has_access_code);
                } else if (error && error.code === 'PGRST116') { // row not found
                    // New device, insert it with default values
                    const now = new Date().toISOString();
                    const { error: insertError } = await supabase
                        .from('guest_devices')
                        .insert({ 
                            device_id: id, 
                            generation_count: 0, 
                            has_access_code: false,
                            first_seen_at: now,
                            last_seen_at: now,
                        });
                    
                    if (insertError) {
                        console.error("Error creating guest device record:", insertError);
                    }
                    setGuestGenerationCount(0);
                    setHasValidAccessCode(false);
                } else if (error) {
                    console.error("Error fetching guest device data:", error);
                    setGuestGenerationCount(0); // Fallback on error
                    setHasValidAccessCode(false);
                }
            } catch (e) {
                console.error("An exception occurred during device initialization:", e);
                setGuestGenerationCount(0); // Fallback on exception
                setHasValidAccessCode(false);
            }
        }
    };
    initDevice();
  }, []);
  
  // Effect to show the trial notification once
  useEffect(() => {
    if (page === 'generator') {
      const hasSeenToast = localStorage.getItem('hasSeenTrialNotification');
      const isGuestUser = !hasValidAccessCode;

      if (!hasSeenToast && isGuestUser) {
        setShowTrialToast(true);
        localStorage.setItem('hasSeenTrialNotification', 'true');
      }
    }
  }, [page, hasValidAccessCode]);


  // Form State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [photoFormat, setPhotoFormat] = useState<PhotoFormat>('1:1');
  const [aestheticStyle, setAestheticStyle] = useState<AestheticStyle>('cafe_minimalist');
  const [objectStyle, setObjectStyle] = useState<ObjectStyle>('surface');
  const [adStyle, setAdStyle] = useState<AdStyle>('none');
  const [variations, setVariations] = useState<number>(1);
  const [modelGender, setModelGender] = useState<ModelGender>('woman');
  const [modelEthnicity, setModelEthnicity] = useState<ModelEthnicity>('indonesian');
  const [kidsAgeRange, setKidsAgeRange] = useState(''); // New state for kids age range
  const [automotiveModification, setAutomotiveModification] = useState<AutomotiveModification>('none');
  const [carColor, setCarColor] = useState<CarColor>('original');
  const [vehicleType, setVehicleType] = useState<VehicleType>('mobil');
  const [colorTone, setColorTone] = useState<ColorTone>('natural');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customCarColor, setCustomCarColor] = useState('');
  const [addModelToFood, setAddModelToFood] = useState<'yes' | 'no'>('no');

  // Custom Automotive Mod State
  const [spoiler, setSpoiler] = useState<'yes' | 'no'>('no');
  const [wideBody, setWideBody] = useState<'yes' | 'no'>('no');
  const [rims, setRims] = useState<'yes' | 'no'>('no');
  const [hood, setHood] = useState<'yes' | 'no'>('no');
  const [allBumper, setAllBumper] = useState<'yes' | 'no'>('no');
  const [livery, setLivery] = useState<LiveryStyle>('none');
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [stickerPreview, setStickerPreview] = useState<string | null>(null);

  // Add People State
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [personMode, setPersonMode] = useState<'full_body' | 'face_only'>('full_body');
  
  // Custom Fashion Model State
  const [customModelFile, setCustomModelFile] = useState<File | null>(null);
  const [customModelPreview, setCustomModelPreview] = useState<string | null>(null);


  // Generation State
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const isTrialOver = useMemo(() => {
    if (hasValidAccessCode) return false;
    return guestGenerationCount >= GUEST_GENERATION_LIMIT;
  }, [guestGenerationCount, hasValidAccessCode]);

  
  const resetGeneratorState = () => {
    setSelectedCategory(null);
    setImageFile(null);
    setUploadedImagePreview(null);
    setPhotoFormat('1:1');
    setAestheticStyle('cafe_minimalist');
    setObjectStyle('surface');
    setAdStyle('none');
    setVariations(1);
    setGeneratedImages([]);
    setError(null);
    setWarning(null);
    // Reset category-specific states
    setModelGender('woman');
    setModelEthnicity('indonesian');
    setKidsAgeRange('');
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
    setAddModelToFood('no');
  };

  const handleGoHome = () => {
    resetGeneratorState();
    setPage('landing');
  };

  const handleGoToFAQ = () => {
    setPage('faq');
  };

  const handleStart = () => {
    setPage('category');
  };
  
  const handleSelectCategory = (category: ProductCategory) => {
    if (isTrialOver) {
      setPendingCategory(category);
      setIsAccessCodeModalOpen(true);
      return;
    }
    setSelectedCategory(category);
    // Set default style for the selected category
    if (category === 'food_beverage') {
        setAdStyle('indoor_studio');
        setObjectStyle('surface');
    } else {
        setAdStyle('indoor_studio'); 
    }
    setPage('generator');
  };

  const handleVerifyAccessCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('code, is_active')
        .eq('code', code.trim())
        .single();

      if (error || !data || !data.is_active) {
        console.error('Access code verification error:', error?.message);
        return false;
      }

      // Code is valid. Now update the guest device record in Supabase.
      if (deviceId) {
          const { error: updateError } = await supabase
            .from('guest_devices')
            .update({ has_access_code: true })
            .eq('device_id', deviceId);

          if (updateError) {
            console.error("Error updating guest device access status:", updateError);
            // Even if update fails, we can proceed optimistically for better UX
          }
          setHasValidAccessCode(true); // Update state
      }

      setIsAccessCodeModalOpen(false);
      
      if (pendingCategory) {
        setSelectedCategory(pendingCategory);
        setAdStyle('indoor_studio');
        setPage('generator');
        setPendingCategory(null);
      }

      return true;

    } catch (e) {
      console.error('An exception occurred during code verification:', e);
      return false;
    }
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
        const previewUrl = URL.createObjectURL(file);
        setCustomModelPreview(previewUrl);
    } else {
        setCustomModelFile(null);
        setCustomModelPreview(null);
    }
  };

  const handleStickerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setStickerFile(file);
        const previewUrl = URL.createObjectURL(file);
        setStickerPreview(previewUrl);
    } else {
        setStickerFile(null);
        setStickerPreview(null);
    }
  };

  const handlePersonImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setPersonImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setPersonImagePreview(previewUrl);
    } else {
        setPersonImageFile(null);
        setPersonImagePreview(null);
    }
  };

  const handleGenerateClick = async () => {
    if (!imageFile || !selectedCategory) {
      setError('Silakan upload foto produk dan pilih kategori terlebih dahulu.');
      return;
    }

    if (isTrialOver) {
      setIsAccessCodeModalOpen(true);
      return;
    }

    // New: Check if guest has enough credits for the requested variations/video
    if (!hasValidAccessCode) {
      const remainingCredits = GUEST_GENERATION_LIMIT - guestGenerationCount;
      const creditsNeeded = variations;
      if (creditsNeeded > remainingCredits) {
          const pluralVariations = variations > 1 ? 'variasi' : 'variasi';
          const pluralCredits = remainingCredits > 1 ? 'kredit' : 'kredit';
          const errorMessage = `Anda meminta ${variations} ${pluralVariations}, tetapi hanya memiliki sisa ${remainingCredits} ${pluralCredits} gratis. Silakan kurangi jumlah variasi atau upgrade.`;
        setError(errorMessage);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);
    setGeneratedImages([]);
    
    const isFashionWithCustomModel = selectedCategory === 'fashion_lifestyle' && modelGender === 'custom';
    const isFoodWithCustomModel = selectedCategory === 'food_beverage' && addModelToFood === 'yes' && modelGender === 'custom';


    try {
      setLoadingMessage('AI sedang bekerja, mohon tunggu...');
      const result = await generateAdPhotos(
        imageFile,
        selectedCategory,
        adStyle,
        variations,
        photoFormat,
        aestheticStyle,
        modelGender,
        modelEthnicity,
        automotiveModification,
        carColor,
        vehicleType,
        customPrompt,
        customCarColor,
        colorTone,
        spoiler,
        wideBody,
        rims,
        hood,
        allBumper,
        livery,
        stickerFile,
        personImageFile,
        personImageFile ? personMode : undefined,
        (isFashionWithCustomModel || isFoodWithCustomModel) ? customModelFile : null,
        kidsAgeRange,
        addModelToFood,
        selectedCategory === 'food_beverage' ? objectStyle : undefined
      );
      setGeneratedImages(result.images);
      if (result.warning) {
        setWarning(result.warning);
      }
      
      // If user is a guest, update their count based on successful generations
      if (!hasValidAccessCode && deviceId) {
        const creditsUsed = result.images.length;
        if (creditsUsed > 0) {
            const newCount = guestGenerationCount + creditsUsed;
            setGuestGenerationCount(newCount); // Update state immediately for UI responsiveness

            // Asynchronously update Supabase
            supabase
              .from('guest_devices')
              .update({ generation_count: newCount, last_seen_at: new Date().toISOString() })
              .eq('device_id', deviceId)
              .then(({ error: updateError }) => {
                if (updateError) {
                  console.error("Failed to sync guest generation count:", updateError);
                }
              });
        }
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const selectedCategoryLabel = PRODUCT_CATEGORIES.find(c => c.value === selectedCategory)?.label || '';

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onStart={handleStart} onGetAccess={() => setIsPaymentModalOpen(true)} hasValidAccessCode={hasValidAccessCode} />;
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
              disabled={isLoading || !imageFile || isTrialOver}
              className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? ( <> <Spinner /> {'Membuat Gambar...'} </> ) : 'Generate Foto Iklan' }
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
                    <OptionSelector
                        title="2. Pilih Gaya Objek"
                        options={OBJECT_STYLE_OPTIONS}
                        selectedValue={objectStyle}
                        onValueChange={(v) => {
                            const newObjectStyle = v as ObjectStyle;
                            setObjectStyle(newObjectStyle);
                            if (newObjectStyle === 'levitating') {
                                setAddModelToFood('no');
                            }
                        }}
                    />

                    <OptionSelector 
                        title="3. Pilih Gaya Iklan" 
                        options={LEVITATING_FOOD_AD_STYLES} 
                        selectedValue={adStyle} 
                        onValueChange={(v) => setAdStyle(v as AdStyle)}
                    />

                    <OptionSelector title="4. Pilih Tone Warna" options={COLOR_TONE_OPTIONS} selectedValue={colorTone} onValueChange={(v) => setColorTone(v)} />
                    <OptionSelector 
                        title="5. Tambahkan Model?"
                        options={YES_NO_OPTIONS}
                        selectedValue={addModelToFood}
                        onValueChange={(v) => {
                          setAddModelToFood(v);
                          if (v === 'yes') {
                            setObjectStyle('surface'); // Force surface style when model is added
                          }
                        }}
                        disabled={objectStyle === 'levitating'}
                    />
                    {addModelToFood === 'yes' && (
                        <div className="space-y-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <OptionSelector title="Pilih Gender Model" options={MODEL_GENDER_OPTIONS} selectedValue={modelGender} onValueChange={(v) => setModelGender(v)} />
                            
                            {modelGender !== 'custom' && (
                                <OptionSelector title="Pilih Etnis Model" options={MODEL_ETHNICITY_OPTIONS} selectedValue={modelEthnicity} onValueChange={(v) => setModelEthnicity(v)} />
                            )}

                            {modelGender === 'kids' && (
                              <div className="space-y-2">
                                  <label htmlFor="kids-age-range" className="block text-sm font-semibold text-gray-700">Tentukan Rentang Umur (Opsional)</label>
                                  <input 
                                      id="kids-age-range"
                                      type="text" 
                                      value={kidsAgeRange}
                                      onChange={(e) => setKidsAgeRange(e.target.value)}
                                      placeholder="Contoh: 3-5 tahun"
                                      className="w-full text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                                  />
                              </div>
                            )}

                            {modelGender === 'custom' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Upload Foto Model</label>
                                    <p className="text-xs text-gray-500 mb-2">Penting: Foto harus menampilkan seluruh badan (full body) untuk hasil terbaik.</p>
                                    <input 
                                        type="file" 
                                        onChange={handleCustomModelUpload}
                                        accept="image/png, image/jpeg" 
                                        className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100 w-full"
                                    />
                                    {customModelPreview && (
                                        <img src={customModelPreview} alt="Custom model preview" className="mt-2 h-24 w-auto object-contain rounded-md mx-auto bg-gray-100 p-1"/>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                  </>
                )}
                
                {selectedCategory === 'fashion_lifestyle' && (
                  <>
                    <OptionSelector title="2. Pilih Gaya Iklan" options={FASHION_AD_STYLES} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v)} />
                    <OptionSelector title="3. Pilih Model" options={MODEL_GENDER_OPTIONS} selectedValue={modelGender} onValueChange={(v) => setModelGender(v)} />
                    
                    {modelGender !== 'custom' && (
                        <OptionSelector title="4. Pilih Etnis Model" options={MODEL_ETHNICITY_OPTIONS} selectedValue={modelEthnicity} onValueChange={(v) => setModelEthnicity(v)} />
                    )}

                    {modelGender === 'kids' && (
                      <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <label htmlFor="kids-age-range" className="block text-sm font-semibold text-gray-700">Tentukan Rentang Umur (Opsional)</label>
                          <input 
                              id="kids-age-range"
                              type="text" 
                              value={kidsAgeRange}
                              onChange={(e) => setKidsAgeRange(e.target.value)}
                              placeholder="Contoh: 3-5 tahun"
                              className="w-full text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                          />
                      </div>
                    )}

                    {modelGender === 'custom' && (
                        <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <label className="block text-sm font-semibold text-gray-700">Upload Foto Model</label>
                            <p className="text-xs text-gray-500 mb-2">Penting: Foto harus menampilkan seluruh badan (full body) untuk hasil terbaik.</p>
                            <input 
                                type="file" 
                                onChange={handleCustomModelUpload}
                                accept="image/png, image/jpeg" 
                                className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100 w-full"
                            />
                            {customModelPreview && (
                                <img src={customModelPreview} alt="Custom model preview" className="mt-2 h-24 w-auto object-contain rounded-md mx-auto bg-gray-100 p-1"/>
                            )}
                        </div>
                    )}
                  </>
                )}

                {selectedCategory === 'automotive' && (
                    <OptionSelector title="2. Pilih Gaya Iklan" options={AUTOMOTIVE_AD_STYLES} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v)} />
                )}

                <OptionSelector
                    title={selectedCategory === 'food_beverage' ? "6. Jumlah Hasil Variasi" : (selectedCategory === 'fashion_lifestyle' ? "5. Jumlah Hasil Variasi" : "5. Jumlah Hasil Variasi")}
                    options={VARIATION_OPTIONS}
                    selectedValue={variations}
                    onValueChange={(v) => setVariations(v)}
                />
                
                <div>
                  <label htmlFor="custom-prompt" className="block text-lg font-semibold mb-2 text-gray-800">{selectedCategory === 'food_beverage' ? "7. Kustomisasi (Opsional)" : (selectedCategory === 'fashion_lifestyle' ? "6. Kustomisasi (Opsional)" : "6. Kustomisasi (Opsional)")}</label>
                  <textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Contoh: tambahkan efek tertentu"
                    className="w-full appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors"
                    rows={3}
                  />
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
                 {warning && !isLoading && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md" role="alert">
                        <p className="font-bold">Pemberitahuan</p>
                        <p>{warning}</p>
                    </div>
                 )}

                {generatedImages.length > 0 ? (
                  <ImageGrid images={generatedImages} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md border border-gray-100 min-h-[400px]">
                    {isLoading ? (
                      <>
                        <Spinner />
                        <p className="mt-4 text-gray-600 font-semibold text-center">{loadingMessage || 'AI sedang bekerja, mohon tunggu...'}</p>
                        <p className="mt-2 text-sm text-gray-500">Proses ini bisa memakan waktu hingga 1 menit.</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <h2 className="mt-4 text-xl font-bold text-gray-800">Hasil Anda Akan Muncul di Sini</h2>
                        <p className="text-gray-500 mt-1">Lengkapi semua opsi dan baru klik "Generate".</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {selectedCategory === 'automotive' && (
                 <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Opsi Spesifik Otomotif</h3>
                    <OptionSelector title="Pilih Tipe Kendaraan" options={VEHICLE_TYPE_OPTIONS} selectedValue={vehicleType} onValueChange={(v) => setVehicleType(v)} />
                    <OptionSelector title="Pilih Modifikasi" options={vehicleType === 'mobil' ? AUTOMOTIVE_MODIFICATION_OPTIONS : MOTORCYCLE_MODIFICATION_OPTIONS} selectedValue={automotiveModification} onValueChange={(v) => setAutomotiveModification(v)} />
                    
                    {automotiveModification === 'custom' && vehicleType === 'mobil' && (
                        <div className="space-y-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <OptionSelector title="Bumper & Sideskirt" options={YES_NO_OPTIONS} selectedValue={allBumper} onValueChange={(v) => setAllBumper(v)} />
                            <OptionSelector title="Spoiler Belakang" options={YES_NO_OPTIONS} selectedValue={spoiler} onValueChange={(v) => setSpoiler(v)} />
                            <OptionSelector title="Widebody" options={YES_NO_OPTIONS} selectedValue={wideBody} onValueChange={(v) => setWideBody(v)} />
                            <OptionSelector title="Velg Custom" options={YES_NO_OPTIONS} selectedValue={rims} onValueChange={(v) => setRims(v)} />
                            <OptionSelector title="Kap Mesin Custom" options={YES_NO_OPTIONS} selectedValue={hood} onValueChange={(v) => setHood(v)} />
                            <OptionSelector title="Gaya Livery" options={LIVERY_STYLE_OPTIONS} selectedValue={livery} onValueChange={(v) => setLivery(v)} />
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Upload Stiker/Logo (Opsional)</label>
                                <input type="file" onChange={handleStickerUpload} accept="image/png, image/jpeg" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100"/>
                                {stickerPreview && <img src={stickerPreview} alt="sticker preview" className="mt-2 h-12 w-auto object-contain rounded-sm"/>}
                            </div>
                        </div>
                    )}

                    <OptionSelector title="Ubah Warna" options={CAR_COLOR_OPTIONS} selectedValue={carColor} onValueChange={(v) => setCarColor(v)} />
                    {carColor === 'custom' && (
                        <div className="pl-2">
                            <label htmlFor="custom-car-color" className="block text-sm font-medium mb-1 text-gray-700">Tulis Warna Custom:</label>
                            <input
                                id="custom-car-color"
                                type="text"
                                value={customCarColor}
                                onChange={(e) => setCustomCarColor(e.target.value)}
                                placeholder="Contoh: bunglon (hijau ke ungu)"
                                className="w-full text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                            />
                        </div>
                    )}
                     <div className="border-t pt-4 mt-4">
                        <h4 className="text-lg font-bold text-gray-800">Add People (Optional)</h4>
                        <p className="text-xs text-gray-500 mb-2">Upload foto Anda untuk digabungkan dengan mobil.</p>
                        <input 
                            type="file" 
                            onChange={handlePersonImageUpload} 
                            accept="image/png, image/jpeg" 
                            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100 w-full"
                        />
                        {personImagePreview && (
                            <div className="mt-4 space-y-3">
                                <img src={personImagePreview} alt="Person preview" className="h-24 w-auto object-contain rounded-md mx-auto bg-gray-100 p-1"/>
                                <OptionSelector 
                                    title="Pilih Tipe Foto"
                                    options={[
                                        { value: 'full_body', label: 'Full Body' },
                                        { value: 'face_only', label: 'Wajah Saja' },
                                    ]}
                                    selectedValue={personMode}
                                    onValueChange={(v) => setPersonMode(v as 'full_body' | 'face_only')}
                                />
                                <p className="text-xs text-gray-500">
                                    {personMode === 'face_only' 
                                        ? 'AI akan membuat badan yang sesuai dengan pose dan gaya mobil.' 
                                        : 'Pastikan foto Anda menampilkan seluruh badan untuk hasil terbaik.'}
                                </p>
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
        onGetAccess={() => setIsPaymentModalOpen(true)}
        isTrialOver={isTrialOver}
        hasAccessCode={hasValidAccessCode}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer 
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyPolicyModalOpen(true)}
      />
      <NotificationToast
        isVisible={showTrialToast}
        message={`Anda memiliki ${GUEST_GENERATION_LIMIT} kredit percobaan gratis. Setiap variasi yang Anda hasilkan akan menggunakan 1 kredit.`}
        onClose={() => setShowTrialToast(false)}
      />
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onSuccessfulPayment={() => {
            setIsPaymentModalOpen(false);
        }}
      />
      <AccessCodeModal 
        isOpen={isAccessCodeModalOpen}
        onClose={() => setIsAccessCodeModalOpen(false)}
        onVerify={handleVerifyAccessCode}
        onUpgradeClick={() => {
          setIsAccessCodeModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} onClose={() => setIsPrivacyPolicyModalOpen(false)} />
    </div>
  );
};

export default App;