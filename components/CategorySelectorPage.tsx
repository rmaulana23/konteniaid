import React from 'react';
import { PRODUCT_CATEGORIES } from '../constants';
import { ProductCategory } from '../types';

const EMOJIS: Record<ProductCategory, string> = {
    'food_beverage': '🍔',
    'fashion_lifestyle': '👕',
    'automotive': '🚗',
};

const DESCRIPTIONS: Record<ProductCategory, string> = {
    'food_beverage': 'Buat produk Anda melayang dengan efek asap, percikan, dan bahan-bahan segar yang menggugah selera.',
    'fashion_lifestyle': 'Tempatkan produk Anda pada model profesional dalam berbagai setelan gaya hidup, dari studio hingga jalanan kota.',
    'automotive': 'Ubah mobil Anda dengan modifikasi widebody, gaya balap, atau tampilkan dalam adegan sinematik yang dinamis.',
};

interface CategorySelectorPageProps {
    onSelectCategory: (category: ProductCategory) => void;
}

const CategorySelectorPage: React.FC<CategorySelectorPageProps> = ({ onSelectCategory }) => {
    return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 text-center">Pilih Kategori Produk Anda</h1>
            <p className="text-gray-600 mb-12 text-center max-w-2xl">Pilih kategori yang paling sesuai dengan produk Anda untuk mendapatkan hasil AI yang paling optimal.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {PRODUCT_CATEGORIES.map(({ value, label }) => {
                    const emoji = EMOJIS[value];
                    const description = DESCRIPTIONS[value];
                    return (
                        <div
                            key={value}
                            onClick={() => onSelectCategory(value)}
                            className="bg-white p-8 rounded-lg shadow-md border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-brand-secondary hover:-translate-y-2 text-center"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectCategory(value)}
                            aria-label={`Pilih kategori ${label}`}
                        >
                            <span className="text-5xl" role="img" aria-label={`${label} icon`}>{emoji}</span>
                            <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{label}</h3>
                            <p className="text-gray-600">{description}</p>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default CategorySelectorPage;