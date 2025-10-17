import { ProductCategory, AdStyle, SelectOption, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone, LiveryStyle, PhotoFormat, AestheticStyle, ModelEthnicity, ObjectStyle, FoodTheme, PosterStyle, SocialMediaPlatform } from './types';

export const PRODUCT_CATEGORIES: SelectOption<ProductCategory>[] = [
  { value: 'food_beverage', label: 'Makanan & Minuman' },
  { value: 'fashion_lifestyle', label: 'Fashion & Lifestyle' },
  { value: 'automotive', label: 'Otomotif & Modif' },
];

export const PHOTO_FORMAT_OPTIONS: SelectOption<PhotoFormat>[] = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:5', label: '4:5 (Portrait)' },
  { value: '9:16', label: '9:16 (Full Vertical)' },
];

export const AESTHETIC_STYLE_OPTIONS: SelectOption<AestheticStyle>[] = [
  { value: 'cafe_minimalist', label: 'Minimalist Cafe' },
  { value: 'dramatic_spotlight', label: 'Dramatic Spotlight' },
  { value: 'warm_rustic', label: 'Warm Rustic Style' },
];

export const OBJECT_STYLE_OPTIONS: SelectOption<ObjectStyle>[] = [
    { value: 'surface', label: 'Tidak Melayang (Di Permukaan)' },
    { value: 'levitating', label: 'Melayang (Levitating)' },
];

export const VEHICLE_TYPE_OPTIONS: SelectOption<VehicleType>[] = [
    { value: 'mobil', label: 'Mobil' },
    { value: 'motor', label: 'Motor' },
];

export const FOOD_THEME_OPTIONS: SelectOption<FoodTheme>[] = [
  { value: 'image', label: 'Konten Gambar' },
  { value: 'poster', label: 'Poster Promosi' },
];

export const POSTER_STYLE_OPTIONS: SelectOption<PosterStyle>[] = [
  { value: 'modern_clean', label: 'Modern & Bersih' },
  { value: 'bold_energetic', label: 'Tebal & Berenergi' },
  { value: 'elegant_premium', label: 'Elegan & Premium' },
];

export const SOCIAL_MEDIA_PLATFORM_OPTIONS: SelectOption<SocialMediaPlatform>[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x_twitter', label: 'X (Twitter)' },
];

// Opsi untuk gaya melayang di kategori Makanan & Minuman
export const LEVITATING_FOOD_AD_STYLES: SelectOption<AdStyle>[] = [
  { value: 'indoor_studio', label: 'Indoor Studio' },
  { value: 'outdoor_golden_hour', label: 'Outdoor Golden Hour' },
  { value: 'cinematic_night', label: 'Cinematic Night' },
  { value: 'lifestyle_natural', label: 'Lifestyle Natural' },
];

// Opsi khusus untuk kategori Fashion & Lifestyle
export const FASHION_AD_STYLES: SelectOption<AdStyle>[] = [
    { value: 'indoor_studio', label: 'Studio Editorial Style' },
    { value: 'outdoor_golden_hour', label: 'Urban Lifestyle Style' },
    { value: 'lifestyle_natural', label: 'Aesthetic Daily Life Style' },
    { value: 'professional_kitchen', label: 'Professional Kitchen' },
];

// Opsi khusus untuk kategori Otomotif
export const AUTOMOTIVE_AD_STYLES: SelectOption<AdStyle>[] = [
    { value: 'indoor_studio', label: 'Studio Showroom Style' },
    { value: 'outdoor_golden_hour', label: 'Outdoor Action' },
    { value: 'japanese_drifting', label: 'Japanese Drifting' },
    { value: 'city_street', label: 'City Street' },
];

export const AUTOMOTIVE_MODIFICATION_OPTIONS: SelectOption<AutomotiveModification>[] = [
    { value: 'none', label: 'No Modifikasi' },
    { value: 'elegant_luxury', label: 'Elegant Luxury' },
    { value: 'racing_team', label: 'Racing Team' },
    { value: 'off_road_look', label: 'Off-road Look' },
    { value: 'rally_art', label: 'Rally Art' },
    { value: 'custom', label: 'Custom' },
];

export const MOTORCYCLE_MODIFICATION_OPTIONS: SelectOption<AutomotiveModification>[] = [
    { value: 'none', label: 'No Modifikasi' },
    { value: 'elegant_luxury', label: 'Elegant Luxury' },
    { value: 'racing_team', label: 'Racing Team' },
    { value: 'lowrider_style', label: 'Lowrider Style' },
];

export const LIVERY_STYLE_OPTIONS: SelectOption<LiveryStyle>[] = [
    { value: 'none', label: 'Tanpa Livery' },
    { value: 'racing_team', label: 'Racing Team' },
    { value: 'drift_style', label: 'Drift Style' },
];

export const CAR_COLOR_OPTIONS: SelectOption<CarColor>[] = [
    { value: 'original', label: 'Warna Asli' },
    { value: 'metallic_black', label: 'Hitam Metalik' },
    { value: 'pearl_white', label: 'Putih Mutiara' },
    { value: 'candy_red', label: 'Merah Candy' },
    { value: 'gunmetal_gray', label: 'Abu-abu Gunmetal' },
    { value: 'electric_blue', label: 'Biru Elektrik' },
    { value: 'custom', label: 'Custom (Tulis Sendiri)' },
];

export const COLOR_TONE_OPTIONS: SelectOption<ColorTone>[] = [
    { value: 'natural', label: 'Natural (Asli)' },
    { value: 'warm', label: 'Warm (Hangat)' },
    { value: 'cool', label: 'Cool (Dingin)' },
];

export const MODEL_GENDER_OPTIONS: SelectOption<ModelGender>[] = [
    { value: 'woman', label: 'Woman' },
    { value: 'man', label: 'Men' },
    { value: 'kids', label: 'Kids' },
    { value: 'custom', label: 'Custom (Upload Foto Sendiri)' },
];

export const FASHION_MODEL_OPTIONS: SelectOption<ModelGender>[] = [
    { value: 'adult_woman', label: 'Wanita Dewasa' },
    { value: 'adult_man', label: 'Pria Dewasa' },
    { value: 'child_woman', label: 'Anak Perempuan' },
    { value: 'child_man', label: 'Anak Laki-laki' },
    { value: 'custom', label: 'Custom (Upload Foto Sendiri)' },
];

export const MODEL_ETHNICITY_OPTIONS: SelectOption<ModelEthnicity>[] = [
    { value: 'indonesian', label: 'Indonesia (Lokal)' },
    { value: 'caucasian', label: 'Bule' },
];

export const VARIATION_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: '1 Variasi' },
  { value: 2, label: '2 Variasi' },
  { value: 3, label: '3 Variasi' },
];

export const YES_NO_OPTIONS: SelectOption<'yes' | 'no'>[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
];