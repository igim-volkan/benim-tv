import React from 'react';
import { MovieEntry } from '../types';

interface WatchlistCardProps {
    movie: MovieEntry;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({ movie }) => {
    return (
        <div className="group relative bg-black border-4 border-neutral-700 shadow-[8px_8px_0px_#333] flex flex-col h-full hover:border-yellow-400 transition-colors">

            {/* Poster Section */}
            <div className="w-full aspect-[2/3] relative bg-neutral-900 border-b-4 border-neutral-700 overflow-hidden">
                {movie.posterBase64 ? (
                    <img
                        src={movie.posterBase64}
                        alt={movie.title}
                        className="w-full h-full object-cover contrast-125 saturate-150 pixelated group-hover:scale-105 transition-transform duration-500"
                        style={{ imageRendering: 'pixelated' }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-800 text-white p-4">
                        <span className="text-4xl">{movie.emoji || '🎬'}</span>
                        <span className="text-xs mt-2 text-yellow-400 text-center font-bold">NO IMAGE</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-3 bg-black flex flex-col items-center justify-center flex-1">
                <h3 className="text-xl text-yellow-400 leading-tight font-bold uppercase tracking-wide text-center line-clamp-2">
                    {movie.title.toLocaleUpperCase('tr-TR')}
                </h3>
            </div>
        </div>
    );
};
