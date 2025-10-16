import { ProductCategory, AdStyle, SelectOption, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone, LiveryStyle, PhotoFormat, AestheticStyle, ModelEthnicity } from './types';

export const PRODUCT_CATEGORIES: SelectOption<ProductCategory>[] = [
  { value: 'food_beverage', label: 'Makanan & Minuman' },
  { value: 'fashion_lifestyle', label: 'Fashion & Lifestyle' },
  { value: 'automotive', label: 'Otomotif & Modif' },
];

export const PHOTO_FORMAT_OPTIONS: SelectOption<PhotoFormat>[] = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '4:5', label: '4:5 (Portrait)' },
  { value: '9:16', label: '9:16 (Full Vertical)' },
  { value: '16:9', label: '16:9 (Landscape)' },
];

export const AESTHETIC_STYLE_OPTIONS: SelectOption<AestheticStyle>[] = [
  { value: 'cafe_minimalist', label: 'Minimalist Cafe' },
  { value: 'dramatic_spotlight', label: 'Dramatic Spotlight' },
  { value: 'warm_rustic', label: 'Warm Rustic Style' },
];

export const VEHICLE_TYPE_OPTIONS: SelectOption<VehicleType>[] = [
    { value: 'mobil', label: 'Mobil' },
    { value: 'motor', label: 'Motor' },
];

export const AD_STYLES: SelectOption<AdStyle>[] = [
  { value: 'none', label: 'Tanpa Gaya (Estetik Saja)' },
  { value: 'indoor_studio', label: 'Indoor Studio (Melayang)' },
  { value: 'outdoor_golden_hour', label: 'Outdoor Golden Hour (Melayang)' },
  { value: 'cinematic_night', label: 'Cinematic Night (Melayang)' },
  { value: 'lifestyle_natural', label: 'Lifestyle Natural (Melayang)' },
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