import React, { useEffect } from 'react';
import { X, Star, User, Film, ExternalLink, Quote, RefreshCw } from 'lucide-react';
import { MovieEntry } from '../types';
import { StarRating } from './StarRating';

interface SurpriseModalProps {
    movie: MovieEntry | null;
    onClose: () => void;
    onTryAgain: () => void;
    onDelete: (id: string) => void;
    onMoveToWatched: (movie: MovieEntry) => void;
    onDirectorClick: (director: string) => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
    movie,
    onClose,
    onTryAgain
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-4xl bg-neutral-900 border-4 border-white shadow-[0_0_50px_rgba(255,255,255,0.1)] flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[800px]"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black text-white hover:text-red-500 border-2 border-white p-2 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Poster Section (Left) */}
                <div className="w-full md:w-[400px] shrink-0 bg-black relative border-b-4 md:border-b-0 md:border-r-4 border-white">
                    {movie.posterBase64 ? (
                        <img
                            src={movie.posterBase64}
                            alt={movie.title}
                            className="w-full h-full object-cover contrast-125 saturate-150 pixelated"
                        />
                    ) : (
                        <div className="w-full h-[300px] md:h-full flex flex-col items-center justify-center text-6xl text-neutral-700">
                            {movie.emoji}
                        </div>
                    )}

                    {/* Unique Identifier for Surprise Mode */}
                    <div className="absolute top-4 left-4 bg-cyan-400 text-black font-bold px-4 py-1 border-2 border-black shadow-[4px_4px_0px_#000] z-10">
                        300 SÜRPRİZ
                    </div>
                </div>

                {/* Content Section (Right) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-900">
                    <div className="p-6 md:p-8 flex flex-col gap-6">

                        {/* Header */}
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 leading-none uppercase mb-2 text-shadow-sm">
                                        {movie.title.toLocaleUpperCase('tr-TR')}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-sm md:text-base font-bold">
                                <div className="bg-yellow-400 text-black px-3 py-1 border-2 border-transparent">
                                    {movie.year}
                                </div>
                                {movie.genre.map(g => (
                                    <div key={g} className="bg-cyan-900 text-cyan-200 px-3 py-1 border-2 border-cyan-700 uppercase">
                                        {g}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-neutral-700 w-full" />

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                            <div>
                                <div className="flex items-center gap-2 text-neutral-500 mb-1 uppercase text-sm font-bold">
                                    <User size={16} /> Yönetmen
                                </div>
                                <div className="text-white text-xl">
                                    {movie.director}
                                </div>
                            </div>

                            {movie.userRating && (
                                <div>
                                    <div className="flex items-center gap-2 text-neutral-500 mb-1 uppercase text-sm font-bold">
                                        <Star size={16} /> Puanım
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StarRating rating={movie.userRating} readOnly size={24} />
                                        <span className="text-yellow-400 font-bold text-2xl">{movie.userRating}/5</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="bg-black/30 p-6 border-l-4 border-yellow-400">
                            <div className="flex items-center gap-2 text-yellow-400 mb-3 uppercase font-bold tracking-widest text-sm">
                                <Film size={16} /> Özet
                            </div>
                            <p className="text-xl leading-relaxed text-neutral-200 font-serif">
                                {movie.summary}
                            </p>
                        </div>

                        {/* Review */}
                        {movie.userReview && (
                            <div className="bg-neutral-800 p-6 border border-neutral-700 relative group">
                                <Quote className="absolute top-4 right-4 text-neutral-700 w-12 h-12 rotate-180" />
                                <div className="relative z-10">
                                    <div className="text-magenta-500 font-bold mb-2 uppercase text-sm">İncelemem</div>
                                    <p className="text-2xl text-white italic font-serif leading-relaxed">
                                        "{movie.userReview}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="mt-8 flex flex-col gap-4 pt-6 border-t border-neutral-700">



                            {/* Try Again Button */}
                            <button
                                onClick={onTryAgain}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xl py-4 flex items-center justify-center gap-3 transition-colors border-2 border-transparent hover:border-white shadow-lg"
                            >
                                <RefreshCw size={24} className="animate-spin-slow" />
                                <span>BAŞKA FİLM SEÇ</span>
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
