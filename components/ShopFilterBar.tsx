import React from 'react';
import { Product } from '../types';

interface ShopFilterBarProps {
    selectedCategory: Product['category'] | 'TÜMÜ';
    setSelectedCategory: (category: Product['category'] | 'TÜMÜ') => void;
}

export const ShopFilterBar: React.FC<ShopFilterBarProps> = ({ selectedCategory, setSelectedCategory }) => {
    const categories: (Product['category'] | 'TÜMÜ')[] = [
        'TÜMÜ',
        'T-shirt',
        'Torba',
        'Hoodie',
        'Sweatshirt',
        'Yastık',
        'Önlük'
    ];

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b-2 border-neutral-800 pb-4">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                        font-bold transition-colors px-4 py-2 text-lg uppercase tracking-wider
                        ${selectedCategory === category
                            ? 'text-yellow-400 bg-neutral-800'
                            : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                        }
                    `}
                >
                    {category === 'TÜMÜ' ? 'TÜMÜ' : category}
                </button>
            ))}
        </div>
    );
};
