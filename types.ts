export type ProductCategory = 'food_beverage' | 'fashion_lifestyle' | 'automotive';

export type AdStyle = 'indoor_studio' | 'outdoor_golden_hour' | 'cinematic_night' | 'lifestyle_natural' | 'japanese_drifting' | 'city_street' | 'professional_kitchen';

export type ModelGender = 'woman' | 'man';

export type VehicleType = 'mobil' | 'motor';

export type AutomotiveModification = 'none' | 'elegant_luxury' | 'racing_team' | 'custom';

export type CarColor = 'original' | 'metallic_black' | 'pearl_white' | 'candy_red' | 'gunmetal_gray' | 'electric_blue' | 'custom';

export type ColorTone = 'natural' | 'warm' | 'cool';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}