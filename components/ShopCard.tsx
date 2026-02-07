import React from 'react';
import { Product } from '../types';

interface ShopCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ product, onClick }) => {
    return (
        <div
            onClick={() => onClick(product)}
            className="border-2 border-white bg-neutral-900 group cursor-pointer relative overflow-hidden transition-all h-full flex flex-col"
        >
            <div className="aspect-[3/4] bg-black relative border-b-2 border-white w-full">
                {product.label && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 z-10 border border-white shadow-md">
                        {product.label}
                    </div>
                )}
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {product.title}
                    </h3>
                </div>

                <button className="w-full bg-cyan-600 text-white font-bold py-2 border-2 border-transparent group-hover:bg-cyan-400 group-hover:text-black group-hover:border-white transition-all">
                    [ İNCELE ]
                </button>
            </div>
        </div>
    );
};
