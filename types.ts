export type ProductCategory = 'food_beverage' | 'fashion_lifestyle' | 'automotive';

export type PhotoFormat = '1:1' | '4:5' | '9:16' | '16:9';

export type AdStyle = 'none' | 'indoor_studio' | 'outdoor_golden_hour' | 'cinematic_night' | 'lifestyle_natural' | 'japanese_drifting' | 'city_street' | 'professional_kitchen';

export type AestheticStyle = 'cafe_minimalist' | 'dramatic_spotlight' | 'warm_rustic';

export type ObjectStyle = 'surface' | 'levitating';

export type ModelGender = 'woman' | 'man' | 'kids' | 'custom';

export type ModelEthnicity = 'indonesian' | 'caucasian';

export type VehicleType = 'mobil' | 'motor';

export type AutomotiveModification = 'none' | 'elegant_luxury' | 'racing_team' | 'off_road_look' | 'rally_art' | 'custom' | 'lowrider_style';

export type LiveryStyle = 'none' | 'racing_team' | 'drift_style' | 'retro_feel';

export type CarColor = 'original' | 'metallic_black' | 'pearl_white' | 'candy_red' | 'gunmetal_gray' | 'electric_blue' | 'custom';

export type ColorTone = 'natural' | 'warm' | 'cool';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}