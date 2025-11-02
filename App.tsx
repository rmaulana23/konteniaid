
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
import SuggestionPage from './components/SuggestionPage';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';

import { useUser } from './contexts/UserContext';
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
  FoodTheme,
  PosterStyle,
  SocialMediaEntry,
  FashionGender,
  FashionAge,
} from './types';

import {
  PRODUCT_CATEGORIES,
  FOOD_AD_STYLES,
  FASHION_AD_STYLES,
  AUTOMOTIVE_AD_STYLES,
  MODEL_GENDER_OPTIONS,
  FASHION_GENDER_OPTIONS,
  FASHION_AGE_OPTIONS,
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
  FOOD_THEME_OPTIONS,
  POSTER_STYLE_OPTIONS,
  SOCIAL_MEDIA_PLATFORM_OPTIONS,
} from './constants';

type Page = 'landing' | 'category' | 'generator' | 'faq' | 'saran' | 'about' | 'dashboard';

const App: React.FC = () => {
  const { user, profile, setProfile, loading } = useUser();
  
  // App State
  const [page, setPage] = useState<Page>('landing');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [photoFormat, setPhotoFormat] = useState<PhotoFormat>('9:16');
  const [aestheticStyle, setAestheticStyle] = useState<AestheticStyle>('cafe_minimalist');
  const [objectStyle, setObjectStyle] = useState<ObjectStyle>('surface');
  const [adStyle, setAdStyle] = useState<AdStyle>('none');
  const [variations, setVariations] = useState<number>(1);
  const [modelGender, setModelGender] = useState<ModelGender>('woman');
  const [modelEthnicity, setModelEthnicity] = useState<ModelEthnicity>('indonesian');
  const [automotiveModification, setAutomotiveModification] = useState<AutomotiveModification>('none');
  const [carColor, setCarColor] = useState<CarColor>('original');
  const [vehicleType, setVehicleType] = useState<VehicleType>('mobil');
  const [colorTone, setColorTone] = useState<ColorTone>('natural');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customCarColor, setCustomCarColor] = useState('');
  const [addModelToFood, setAddModelToFood] = useState<'yes' | 'no'>('no');
  const [foodTheme, setFoodTheme] = useState<FoodTheme>('image');
  const [productName, setProductName] = useState('');
  const [productSlogan, setProductSlogan] = useState('');
  const [posterStyle, setPosterStyle] = useState<PosterStyle>('modern_clean');
  const [callToAction, setCallToAction] = useState('');
  const [socialMediaEntries, setSocialMediaEntries] = useState<SocialMediaEntry[]>([]);
  const [fashionGender, setFashionGender] = useState<FashionGender>('woman');
  const [fashionAge, setFashionAge] = useState<FashionAge>('adult');
  const [useMannequin, setUseMannequin] = useState<'yes' | 'no'>('no');
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
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Admin redirect logic
  useEffect(() => {
    // If profile is loaded, user is an admin, and they are on the landing/category page, redirect to dashboard.
    // This allows them to navigate to other pages like FAQ without being forced back.
    if (profile?.is_admin && (page === 'landing' || page === 'category')) {
      setPage('dashboard');
    }
  }, [profile, page]);

  const resetGeneratorState = () => {
    setSelectedCategory(null);
    setImageFile(null);
    setUploadedImagePreview(null);
    setPhotoFormat('9:16');
    setAestheticStyle('cafe_minimalist');
    setObjectStyle('surface');
    setAdStyle('none');
    setVariations(1);
    setGeneratedImages([]);
    setError(null);
    setWarning(null);
    setModelGender('woman');
    setModelEthnicity('indonesian');
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
    setFoodTheme('image');
    setProductName('');
    setProductSlogan('');
    setPosterStyle('modern_clean');
    setSocialMediaEntries([]);
    setCallToAction('');
    setFashionGender('woman');
    setFashionAge('adult');
    setUseMannequin('no');
  };

  const handleGoHome = () => {
    resetGeneratorState();
    // For admins, "home" is the dashboard. The useEffect will handle the redirect.
    setPage('landing');
  };

  const handleGoToFAQ = () => setPage('faq');
  const handleGoToAbout = () => setPage('about');
  const handleGoToSaran = () => setPage('saran');

  const handleStart = () => {
    setPage('category');
  };
  
  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    // Set default style for the selected category
    if (category === 'food_beverage') {
        setAdStyle('indoor_studio');
        setObjectStyle('surface');
        setModelGender('woman');
        setFoodTheme('image');
        setPosterStyle('modern_clean');
        setPhotoFormat('9:16');
    } else if (category === 'fashion_lifestyle') {
        setAdStyle('indoor_studio');
        setFashionGender('woman');
        setFashionAge('adult');
        setUseMannequin('no');
        setPhotoFormat('4:5');
    } else {
        setAdStyle('indoor_studio');
        setPhotoFormat('1:1');
    }
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
  
  const handleAddSocialMedia = () => setSocialMediaEntries(prev => [...prev, { id: Date.now(), platform: 'instagram', handle: '' }]);
  const handleRemoveSocialMedia = (id: number) => setSocialMediaEntries(prev => prev.filter(entry => entry.id !== id));
  const handleSocialMediaChange = (id: number, field: 'platform' | 'handle', value: string) => setSocialMediaEntries(prev => prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));

  const handleGenerateClick = async () => {
    if (!user || !profile) {
      setError('Silakan login terlebih dahulu untuk membuat gambar.');
      return;
    }
    
    if (profile.generation_count >= profile.generation_limit) {
      setError(`Anda telah mencapai batas ${profile.generation_limit} generasi harian. Silakan upgrade untuk akses lebih banyak atau coba lagi besok.`);
      setIsPaymentModalOpen(true); // Open payment modal when limit is reached
      return;
    }
    
    if (!imageFile || !selectedCategory) {
      setError('Silakan upload foto produk dan pilih kategori terlebih dahulu.');
      return;
    }
    if (selectedCategory === 'food_beverage' && foodTheme === 'poster' && (!productName.trim() || !productSlogan.trim())) {
      setError('Untuk tema Poster, Nama Produk dan Slogan/Promo wajib diisi.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning(null);
    setGeneratedImages([]);
    
    const isFashionWithCustomModel = selectedCategory === 'fashion_lifestyle' && fashionGender === 'custom';
    const isFoodWithCustomModel = selectedCategory === 'food_beverage' && addModelToFood === 'yes' && modelGender === 'custom';

    try {
      setLoadingMessage('AI sedang bekerja, mohon tunggu...');
      const result = await generateAdPhotos(
        imageFile, selectedCategory, adStyle, variations, photoFormat, aestheticStyle, modelGender, modelEthnicity,
        automotiveModification, carColor, vehicleType, customPrompt, customCarColor, colorTone, spoiler, wideBody, rims, hood,
        allBumper, livery, stickerFile, personImageFile, personImageFile ? personMode : undefined,
        (isFashionWithCustomModel || isFoodWithCustomModel) ? customModelFile : null,
        addModelToFood, selectedCategory === 'food_beverage' ? objectStyle : undefined, undefined, foodTheme, productName,
        productSlogan, posterStyle, socialMediaEntries, callToAction, fashionGender, fashionAge, useMannequin
      );
      setGeneratedImages(result.images);
      if (result.warning) setWarning(result.warning);

      // Update generation count in Supabase
      const newCount = profile.generation_count + result.images.length;
      const { error: updateError } = await supabase
          .from('profiles')
          .update({ generation_count: newCount })
          .eq('id', user.id);
      
      if (updateError) {
          console.error('Failed to update generation count:', updateError);
          setWarning(prev => (prev ? prev + ' ' : '') + 'Gagal menyimpan progres Anda, tapi jangan khawatir, gambar berhasil dibuat.');
      } else {
          // Update local state to reflect the change immediately
          setProfile(prev => prev ? { ...prev, generation_count: newCount } : null);
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const selectedCategoryLabel = PRODUCT_CATEGORIES.find(c => c.value === selectedCategory)?.label || '';
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-background items-center justify-center">
        <Spinner />
        <p className="mt-4 text-gray-600">Memuat sesi...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onStart={handleStart} onGetAccess={() => setIsPaymentModalOpen(true)} />;
      case 'category':
        return <CategorySelectorPage onSelectCategory={handleSelectCategory} />;
      case 'faq': return <FAQPage />;
      case 'saran': return <SuggestionPage />;
      case 'about': return <AboutPage />;
      case 'dashboard': return <Dashboard />;
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
              disabled={isLoading || !imageFile}
              className="w-full bg-gradient-to-r from-brand-primary to-teal-500 hover:from-brand-secondary hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? ( <> <Spinner /> {'Membuat Gambar...'} </> ) : 'Generate Foto Iklan' }
            </button>
        );
        
        const RemoveIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);

        return (
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
            <div className="mb-4 text-sm text-gray-500">
                <button onClick={() => { resetGeneratorState(); setPage('category'); }} className="hover:text-brand-secondary">
                  Pilih Kategori
                </button> &gt; <span>{selectedCategoryLabel}</span>
            </div>
            <div className={`grid grid-cols-1 ${gridColsClass} gap-6 items-start`}>
              
              <div className="lg:col-span-1 space-y-4 bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <div>
                    <ImageUploader onImageUpload={handleImageUpload} uploadedImagePreview={uploadedImagePreview} />
                    <p className="text-xs text-gray-500 mt-1 px-1">Unggah foto produk Anda dengan latar belakang polos untuk hasil terbaik.</p>
                </div>
                
                {selectedCategory === 'food_beverage' && (
                  <>
                    <div>
                        <OptionSelector
                            title="2. Pilih Jenis Tema"
                            options={FOOD_THEME_OPTIONS}
                            selectedValue={foodTheme}
                            onValueChange={(v) => setFoodTheme(v as FoodTheme)}
                        />
                        <p className="text-xs text-gray-500 mt-1 px-1">Pilih 'Konten Gambar' untuk foto produk standar atau 'Poster' untuk membuat materi promosi lengkap.</p>
                    </div>

                    {foodTheme === 'poster' && (
                      <div className="space-y-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800">3. Isi Detail Poster</h3>
                        <div className="space-y-4">
                            <div>
                              <label htmlFor="product-name" className="block text-sm font-semibold mb-1 text-gray-700">Nama Produk</label>
                              <input
                                id="product-name"
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Contoh: Kopi Susu Nikmat"
                                className="w-full text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">Teks ini akan menjadi judul utama di poster Anda.</p>
                            </div>
                            <div>
                              <label htmlFor="product-slogan" className="block text-sm font-semibold mb-1 text-gray-700">Slogan / Promo</label>
                              <input
                                id="product-slogan"
                                type="text"
                                value={productSlogan}
                                onChange={(e) => setProductSlogan(e.target.value)}
                                placeholder="Contoh: Beli 1 Gratis 1"
                                className="w-full text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">Tulis penawaran menarik seperti "Beli 1 Gratis 1" atau tagline produk.</p>
                            </div>
                            <div>
                              <label htmlFor="call-to-action" className="block text-sm font-semibold mb-1 text-gray-700">Kalimat Ajakan (Opsional)</label>
                              <input
                                id="call-to-action"
                                type="text"
                                value={callToAction}
                                onChange={(e) => setCallToAction(e.target.value)}
                                placeholder="Contoh: Pesan Sekarang!"
                                className="w-full text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                              />
                              <p className="text-xs text-gray-500 mt-1">Teks untuk tombol aksi, contoh: "Pesan Sekarang!".</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Social Media (Opsional)</label>
                                <div className="space-y-2">
                                    {socialMediaEntries.map((entry, index) => (
                                        <div key={entry.id} className="flex items-center gap-2">
                                            <select 
                                                value={entry.platform} 
                                                onChange={(e) => handleSocialMediaChange(entry.id, 'platform', e.target.value)}
                                                className="w-1/3 text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-2 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-secondary">
                                                {SOCIAL_MEDIA_PLATFORM_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                            <input
                                                type="text"
                                                value={entry.handle}
                                                onChange={(e) => handleSocialMediaChange(entry.id, 'handle', e.target.value)}
                                                placeholder="Username"
                                                className="flex-grow text-sm appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50"
                                            />
                                            <button 
                                                onClick={() => handleRemoveSocialMedia(entry.id)}
                                                className="p-1.5 text-red-500 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Hapus media sosial">
                                                <RemoveIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleAddSocialMedia} className="mt-2 text-sm font-semibold text-brand-secondary hover:text-brand-primary">+ Tambah Media Sosial</button>
                                <p className="text-xs text-gray-500 mt-1">Tambahkan akun media sosial Anda untuk ditampilkan di poster.</p>
                            </div>

                             <div>
                                <OptionSelector
                                    title="Gaya Poster"
                                    options={POSTER_STYLE_OPTIONS}
                                    selectedValue={posterStyle}
                                    onValueChange={(v) => setPosterStyle(v as PosterStyle)}
                                />
                                <p className="text-xs text-gray-500 mt-1 px-1">Pilih estetika visual yang sesuai dengan merek Anda.</p>
                             </div>
                        </div>
                      </div>
                    )}

                    {foodTheme === 'image' && (
                      <>
                        <div>
                            <OptionSelector
                                title="3. Pilih Gaya Objek"
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
                            <p className="text-xs text-gray-500 mt-1 px-1">'Melayang' untuk efek dramatis, atau 'Di Permukaan' untuk tampilan klasik.</p>
                        </div>

                        <div>
                            <OptionSelector 
                                title="4. Pilih Gaya Iklan"
                                options={FOOD_AD_STYLES} 
                                selectedValue={adStyle} 
                                onValueChange={(v) => setAdStyle(v as AdStyle)}
                            />
                            <p className="text-xs text-gray-500 mt-1 px-1">Tentukan latar belakang dan suasana keseluruhan foto. Efek dinamis seperti percikan atau uap akan ditambahkan secara otomatis.</p>
                        </div>

                        <div>
                            <OptionSelector 
                                title="5. Tambahkan Model?"
                                options={YES_NO_OPTIONS}
                                selectedValue={addModelToFood}
                                onValueChange={(v) => {
                                  setAddModelToFood(v as 'yes' | 'no');
                                  if (v === 'yes') {
                                    setObjectStyle('surface'); // Force surface style when model is added
                                  }
                                }}
                                disabled={objectStyle === 'levitating'}
                            />
                            <p className="text-xs text-gray-500 mt-1 px-1">Sertakan model untuk memberikan sentuhan gaya hidup pada produk Anda.</p>
                        </div>
                        {addModelToFood === 'yes' && (
                            <div className="space-y-3 border border-gray-200 rounded-lg p-2 bg-gray-50">
                                <OptionSelector title="Pilih Gender Model" options={MODEL_GENDER_OPTIONS} selectedValue={modelGender} onValueChange={(v) => setModelGender(v as ModelGender)} />
                                
                                {modelGender !== 'custom' && (
                                    <OptionSelector title="Pilih Etnis Model" options={MODEL_ETHNICITY_OPTIONS} selectedValue={modelEthnicity} onValueChange={(v) => setModelEthnicity(v as ModelEthnicity)} />
                                )}

                                {modelGender === 'custom' && (
                                    <div className="space-y-1">
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
                  </>
                )}
                
                {selectedCategory === 'fashion_lifestyle' && (
                  <>
                    <div>
                        <OptionSelector title="2. Pilih Gaya Iklan" options={FASHION_AD_STYLES} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v as AdStyle)} />
                        <p className="text-xs text-gray-500 mt-1 px-1">Pilih suasana pemotretan yang paling sesuai dengan citra merek Anda.</p>
                    </div>
                    <div>
                        <OptionSelector title="3. Pilih Model" options={FASHION_GENDER_OPTIONS} selectedValue={fashionGender} onValueChange={(v) => setFashionGender(v as FashionGender)} />
                        <p className="text-xs text-gray-500 mt-1 px-1">Pilih gender model atau upload foto model Anda sendiri.</p>
                    </div>

                    {fashionGender !== 'custom' && (
                        <div className="space-y-4 border-l-2 border-brand-primary/50 pl-4 ml-2 bg-gray-50/50 py-3 rounded-r-lg">
                            <div>
                                <label className="block text-lg font-semibold mb-2 text-gray-800">Detail Model</label>
                                <div className="space-y-4">
                                    <OptionSelector title="Pilih Usia" options={FASHION_AGE_OPTIONS} selectedValue={fashionAge} onValueChange={(v) => setFashionAge(v as FashionAge)} />
                                    <OptionSelector title="Gunakan Manekin?" options={YES_NO_OPTIONS} selectedValue={useMannequin} onValueChange={(v) => setUseMannequin(v as 'yes' | 'no')} />
                                    <OptionSelector title="Pilih Etnis" options={MODEL_ETHNICITY_OPTIONS} selectedValue={modelEthnicity} onValueChange={(v) => setModelEthnicity(v as ModelEthnicity)} disabled={useMannequin === 'yes'} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 px-1">Opsi Etnis diabaikan jika menggunakan manekin.</p>
                            </div>
                        </div>
                    )}

                    {fashionGender === 'custom' && (
                        <div className="space-y-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <label className="block text-lg font-semibold text-gray-800">Upload Foto Model</label>
                            <p className="text-xs text-gray-500 mb-2">Penting: Foto harus menampilkan seluruh badan (full body) untuk hasil terbaik.</p>
                            <p className="text-xs text-gray-500 -mt-1 mb-2">AI akan mengganti pakaian model asli dengan produk yang Anda unggah.</p>
                            <input 
                                type="file" 
                                onChange={handleCustomModelUpload}
                                accept="image/png, image/jpeg" 
                                className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100 w-full"
                            />
                            {customModelPreview && (
                                <img src={customModelPreview} alt="Custom model preview" className="mt-2 h-24 w-auto object-contain rounded-md mx-auto bg-gray-100 p-1"/>
                            )}
                        </div>
                    )}
                  </>
                )}


                {selectedCategory === 'automotive' && (
                    <div>
                        <OptionSelector title="2. Pilih Gaya Iklan" options={AUTOMOTIVE_AD_STYLES} selectedValue={adStyle} onValueChange={(v) => setAdStyle(v as AdStyle)} />
                        <p className="text-xs text-gray-500 mt-1 px-1">Tentukan lokasi dan suasana pemotretan untuk kendaraan Anda.</p>
                    </div>
                )}

                <div>
                    <OptionSelector
                        title="Jumlah Hasil Variasi"
                        options={VARIATION_OPTIONS}
                        selectedValue={variations}
                        onValueChange={(v) => setVariations(v as number)}
                    />
                    <p className="text-xs text-gray-500 mt-1 px-1">Pilih berapa banyak gambar unik yang ingin Anda hasilkan sekaligus.</p>
                </div>
                
                <div>
                  <label htmlFor="custom-prompt" className="block text-lg font-semibold mb-1 text-gray-800">Kustomisasi (Opsional)</label>
                  <textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Contoh: tambahkan efek tertentu"
                    className="w-full appearance-none bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:bg-gray-50 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/50 transition-colors"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1 px-1">Berikan instruksi tambahan kepada AI untuk detail yang lebih spesifik.</p>
                </div>
                
                {selectedCategory !== 'automotive' && GenerateButton}
              </div>

              <div className={`${resultsColSpanClass} space-y-6 ${selectedCategory === 'automotive' ? 'order-last lg:order-none' : ''}`}>
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
                 <div className="lg:col-span-1 space-y-4 bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Opsi Spesifik Otomotif</h3>
                    <div>
                        <OptionSelector title="Pilih Tipe Kendaraan" options={VEHICLE_TYPE_OPTIONS} selectedValue={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)} />
                        <p className="text-xs text-gray-500 mt-1 px-1">Pilih antara mobil atau motor untuk opsi modifikasi yang sesuai.</p>
                    </div>
                    <div>
                        <OptionSelector title="Pilih Modifikasi" options={vehicleType === 'mobil' ? AUTOMOTIVE_MODIFICATION_OPTIONS : MOTORCYCLE_MODIFICATION_OPTIONS} selectedValue={automotiveModification} onValueChange={(v) => setAutomotiveModification(v as AutomotiveModification)} />
                        <p className="text-xs text-gray-500 mt-1 px-1">Pilih gaya modifikasi yang telah ditentukan atau pilih 'Custom' untuk detail lebih lanjut.</p>
                    </div>
                    
                    {automotiveModification === 'custom' && vehicleType === 'mobil' && (
                        <div className="space-y-3 border border-gray-200 rounded-lg p-2 bg-gray-50">
                            <OptionSelector title="Bumper & Sideskirt" options={YES_NO_OPTIONS} selectedValue={allBumper} onValueChange={(v) => setAllBumper(v as 'yes' | 'no')} />
                            <OptionSelector title="Spoiler Belakang" options={YES_NO_OPTIONS} selectedValue={spoiler} onValueChange={(v) => setSpoiler(v as 'yes' | 'no')} />
                            <OptionSelector title="Widebody" options={YES_NO_OPTIONS} selectedValue={wideBody} onValueChange={(v) => setWideBody(v as 'yes' | 'no')} />
                            <OptionSelector title="Velg Custom" options={YES_NO_OPTIONS} selectedValue={rims} onValueChange={(v) => setRims(v as 'yes' | 'no')} />
                            <OptionSelector title="Kap Mesin Custom" options={YES_NO_OPTIONS} selectedValue={hood} onValueChange={(v) => setHood(v as 'yes' | 'no')} />
                            <OptionSelector title="Gaya Livery" options={LIVERY_STYLE_OPTIONS} selectedValue={livery} onValueChange={(v) => setLivery(v as LiveryStyle)} />
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Upload Stiker/Logo (Opsional)</label>
                                <input type="file" onChange={handleStickerUpload} accept="image/png, image/jpeg" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100"/>
                                {stickerPreview && <img src={stickerPreview} alt="sticker preview" className="mt-2 h-12 w-auto object-contain rounded-sm"/>}
                            </div>
                        </div>
                    )}

                    <div>
                        <OptionSelector title="Ubah Warna" options={CAR_COLOR_OPTIONS} selectedValue={carColor} onValueChange={(v) => setCarColor(v as CarColor)} />
                        <p className="text-xs text-gray-500 mt-1 px-1">Ganti warna kendaraan Anda atau biarkan sesuai warna aslinya.</p>
                    </div>
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
                        <p className="text-xs text-gray-500 mb-2">AI akan menempatkan orang di samping kendaraan secara realistis.</p>
                        <input 
                            type="file" 
                            onChange={handlePersonImageUpload} 
                            accept="image/png, image/jpeg" 
                            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-secondary hover:file:bg-blue-100 w-full"
                        />
                        {personImagePreview && (
                            <div className="mt-4 space-y-2">
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
        onGoToAbout={handleGoToAbout}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyPolicyModalOpen(true)}
        onGetAccess={() => setIsPaymentModalOpen(true)}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer 
        onOpenSaran={handleGoToSaran}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyPolicyModalOpen(true)}
        hasAccessCode={!!user}
      />
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onSuccessfulPayment={() => {
            setIsPaymentModalOpen(false);
        }}
      />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} onClose={() => setIsPrivacyPolicyModalOpen(false)} />
    </div>
  );
};

export default App;