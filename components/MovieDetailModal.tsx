import React, { useEffect, useState } from 'react';
import { X, Star, Calendar, User, Film, Trash2, ExternalLink, Quote } from 'lucide-react';
import { MovieEntry } from '../types';
import { StarRating } from './StarRating';

interface MovieDetailModalProps {
    movie: MovieEntry | null;
    onClose: () => void;
    onDelete?: (id: string) => void;
    onVote?: (id: string, voteType: 'agree' | 'disagree') => void;
    onDirectorClick?: (director: string) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose, onDelete, onVote, onDirectorClick }) => {
    const [hasVoted, setHasVoted] = useState(false);
    const [optimisticVote, setOptimisticVote] = useState<'agree' | 'disagree' | null>(null);

    useEffect(() => {
        if (movie) {
            const votedMovies = JSON.parse(localStorage.getItem('voted_movies') || '[]');
            setHasVoted(votedMovies.includes(movie.id));
            setOptimisticVote(null); // Reset when movie changes
        }
    }, [movie]);

    const handleVote = (type: 'agree' | 'disagree') => {
        if (!movie || !onVote || hasVoted) return;

        onVote(movie.id, type);

        const votedMovies = JSON.parse(localStorage.getItem('voted_movies') || '[]');
        localStorage.setItem('voted_movies', JSON.stringify([...votedMovies, movie.id]));
        setHasVoted(true);
        setOptimisticVote(type);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!movie) return null;

    const renderRatingAndVoting = () => {
        if (!movie.userRating) return null;
        return (
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-black/20 p-4 lg:p-6 border-l-4 border-neutral-700 rounded-r-lg">
                {/* User Rating */}
                <div className="flex flex-col shrink-0">
                    <div className="flex items-center gap-2 text-neutral-500 mb-2 uppercase text-sm font-bold">
                        <Star size={16} /> Puanım
                    </div>
                    <div className="flex items-center gap-2">
                        <StarRating rating={movie.userRating} readOnly size={20} />
                        <span className="text-yellow-400 font-bold text-2xl">{movie.userRating}/5</span>
                    </div>
                </div>

                {/* Vertical Divider for desktop */}
                <div className="hidden lg:block w-px h-16 bg-neutral-700"></div>
                {/* Horizontal Divider for mobile */}
                <div className="block lg:hidden w-full h-px bg-neutral-700"></div>

                {/* VISITOR VOTING UI */}
                <div className="flex-1 w-full flex flex-col justify-center">
                    <div className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Sence?</div>
                    <div className="flex flex-col sm:flex-row items-stretch gap-2">
                        <button
                            onClick={() => handleVote('agree')}
                            disabled={hasVoted}
                            className={`flex-1 py-2 px-3 font-bold text-sm border-2 transition-colors flex justify-center items-center gap-1.5 
                                ${hasVoted
                                    ? optimisticVote === 'agree' ? 'bg-green-900 text-green-300 border-green-700' : 'bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed'
                                    : 'bg-green-900/30 text-green-400 border-green-800 hover:bg-green-900/60 hover:border-green-500'}`}
                        >
                            <span className="text-xl leading-none pt-1">😍</span>
                            <span className="text-lg md:text-xl font-black">({(movie.agreeVotes || 0) + (optimisticVote === 'agree' ? 1 : 0)})</span>
                        </button>
                        <button
                            onClick={() => handleVote('disagree')}
                            disabled={hasVoted}
                            className={`flex-1 py-2 px-3 font-bold text-sm border-2 transition-colors flex justify-center items-center gap-1.5 
                                ${hasVoted
                                    ? optimisticVote === 'disagree' ? 'bg-red-900 text-red-300 border-red-700' : 'bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed'
                                    : 'bg-red-900/30 text-red-400 border-red-800 hover:bg-red-900/60 hover:border-red-500'}`}
                        >
                            <span className="text-xl leading-none pt-1">🤮</span>
                            <span className="text-lg md:text-xl font-black">({(movie.disagreeVotes || 0) + (optimisticVote === 'disagree' ? 1 : 0)})</span>
                        </button>
                    </div>
                    {hasVoted && <div className="text-yellow-500 text-xs mt-2 text-center lg:text-left">Fikrini belirttiğin için teşekkürler!</div>}
                </div>
            </div>
        );
    };

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
                    {(movie.posterUrl || movie.posterBase64) ? (
                        <img
                            src={movie.posterUrl || movie.posterBase64}
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
                                {(movie.posterUrl || movie.posterBase64) ? (
                                    <img
                                        src={movie.posterUrl || movie.posterBase64}
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
                                <div className="flex flex-wrap gap-2 text-xs font-bold mt-2">
                                    <div className="bg-yellow-400 text-black px-2 py-0.5 border border-transparent flex items-center">
                                        {movie.year}
                                    </div>
                                    {movie.genre.slice(0, 2).map(g => (
                                        <div key={g} className="bg-cyan-900 text-cyan-200 px-2 py-0.5 border border-cyan-700 uppercase flex items-center">
                                            {g}
                                        </div>
                                    ))}
                                    <div className="flex flex-wrap gap-1 items-center">
                                        {movie.director.split(/,\s*|\s+ve\s+|\s+&\s+/).map((dir, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (onDirectorClick) {
                                                        onDirectorClick(dir.trim());
                                                        onClose();
                                                    }
                                                }}
                                                className="bg-neutral-800 text-neutral-300 px-2 py-0.5 border border-neutral-700 uppercase hover:bg-neutral-700 hover:text-white transition-colors"
                                            >
                                                {dir.trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Desktop Header - Hidden on Mobile */}
                        <div className="hidden md:block">
                            <h2 className="text-5xl font-bold text-yellow-400 leading-none uppercase mb-2 text-shadow-sm">
                                {movie.title.toLocaleUpperCase('tr-TR')}
                            </h2>
                            <div className="flex flex-wrap gap-2 text-base font-bold mt-2">
                                <div className="bg-yellow-400 text-black px-3 py-1 border-2 border-transparent flex items-center">
                                    {movie.year}
                                </div>
                                {movie.genre.map(g => (
                                    <div key={g} className="bg-cyan-900 text-cyan-200 px-3 py-1 border-2 border-cyan-700 uppercase flex items-center">
                                        {g}
                                    </div>
                                ))}
                                <div className="flex flex-wrap gap-2 items-center">
                                    {movie.director.split(/,\s*|\s+ve\s+|\s+&\s+/).map((dir, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                if (onDirectorClick) {
                                                    onDirectorClick(dir.trim());
                                                    onClose();
                                                }
                                            }}
                                            className="bg-neutral-800 text-neutral-300 px-3 py-1 border-2 border-neutral-700 uppercase hover:bg-neutral-700 hover:text-white transition-colors cursor-pointer"
                                            title="Yönetmenin Diğer Filmlerini Gör"
                                        >
                                            {dir.trim()}
                                        </button>
                                    ))}
                                </div>
                            </div>
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


                        {/* Rating and Voting (Now Desktop & Mobile unified location) */}
                        {renderRatingAndVoting()}

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
                        <div className="flex items-center justify-between">
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
