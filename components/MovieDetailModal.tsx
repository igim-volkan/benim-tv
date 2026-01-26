import React, { useEffect } from 'react';
import { X, Star, Calendar, User, Film, Trash2, ExternalLink, Quote } from 'lucide-react';
import { MovieEntry } from '../types';
import { StarRating } from './StarRating';

interface MovieDetailModalProps {
    movie: MovieEntry | null;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose, onDelete }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
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

                {/* Desktop Poster (Left Column) - Hidden on Mobile */}
                <div className="hidden md:block w-[400px] shrink-0 bg-black relative border-r-4 border-white">
                    {movie.posterBase64 ? (
                        <img
                            src={movie.posterBase64}
                            alt={movie.title}
                            className="w-full h-full object-cover contrast-125 saturate-150 pixelated"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-6xl text-neutral-700">
                            {movie.emoji}
                        </div>
                    )}
                </div>

                {/* Content Section (Right) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-900">
                    <div className="p-4 md:p-8 flex flex-col gap-6">

                        {/* Mobile Header (Side-by-Side: Poster + Info) - Hidden on Desktop */}
                        <div className="flex gap-4 md:hidden items-start pr-12">
                            {/* Mobile Poster Thumbnail */}
                            <div className="w-1/3 shrink-0 border-2 border-white">
                                {movie.posterBase64 ? (
                                    <img
                                        src={movie.posterBase64}
                                        alt={movie.title}
                                        className="w-full h-auto object-cover aspect-[2/3] contrast-125 saturate-150 pixelated"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/3] bg-neutral-800 flex items-center justify-center text-4xl">
                                        {movie.emoji}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Title & Meta */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-3xl font-bold text-yellow-400 leading-none uppercase mb-2 text-shadow-sm break-words">
                                    {movie.title.toLocaleUpperCase('tr-TR')}
                                </h2>
                                <div className="flex flex-wrap gap-2 text-xs font-bold">
                                    <div className="bg-yellow-400 text-black px-2 py-0.5 border border-transparent">
                                        {movie.year}
                                    </div>
                                    {movie.genre.slice(0, 2).map(g => (
                                        <div key={g} className="bg-cyan-900 text-cyan-200 px-2 py-0.5 border border-cyan-700 uppercase">
                                            {g}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Header - Hidden on Mobile */}
                        <div className="hidden md:block">
                            <h2 className="text-5xl font-bold text-yellow-400 leading-none uppercase mb-2 text-shadow-sm">
                                {movie.title.toLocaleUpperCase('tr-TR')}
                            </h2>
                            <div className="flex flex-wrap gap-2 text-base font-bold">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-base md:text-lg">
                            <div>
                                <div className="flex items-center gap-2 text-neutral-500 mb-1 uppercase text-sm font-bold">
                                    <User size={16} /> Yönetmen
                                </div>
                                <div className="text-white text-lg md:text-xl">
                                    {movie.director}
                                </div>
                            </div>

                            {movie.userRating && (
                                <div>
                                    <div className="flex items-center gap-2 text-neutral-500 mb-1 uppercase text-sm font-bold">
                                        <Star size={16} /> Puanım
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StarRating rating={movie.userRating} readOnly size={20} />
                                        <span className="text-yellow-400 font-bold text-xl md:text-2xl">{movie.userRating}/5</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="bg-black/30 p-4 md:p-6 border-l-4 border-yellow-400">
                            <div className="flex items-center gap-2 text-yellow-400 mb-2 md:mb-3 uppercase font-bold tracking-widest text-sm">
                                <Film size={16} /> Özet
                            </div>
                            <p className="text-lg md:text-xl leading-relaxed text-neutral-200 font-serif">
                                {movie.summary}
                            </p>
                        </div>

                        {/* Review */}
                        {movie.userReview && (
                            <div className="bg-neutral-800 p-4 md:p-6 border border-neutral-700 relative group">
                                <Quote className="absolute top-4 right-4 text-neutral-700 w-8 h-8 md:w-12 md:h-12 rotate-180" />
                                <div className="relative z-10">
                                    <div className="text-magenta-500 font-bold mb-2 uppercase text-sm">İncelemem</div>
                                    <p className="text-xl md:text-2xl text-white italic font-serif leading-relaxed">
                                        "{movie.userReview}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="mt-4 md:mt-8 flex items-center justify-between pt-6 border-t border-neutral-700">
                            {movie.imdbUrl && (
                                <a
                                    href={movie.imdbUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-yellow-500 hover:text-white transition-colors text-lg font-bold group"
                                >
                                    IMDb <span className="hidden sm:inline">Sayfasına Git</span> <ExternalLink size={20} className="group-hover:-translate-y-1 transition-transform" />
                                </a>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
