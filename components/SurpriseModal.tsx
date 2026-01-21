import React from 'react';
import { MovieEntry } from '../types';
import { MovieCard } from './MovieCard';

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
    onTryAgain,
    onDelete,
    onMoveToWatched,
    onDirectorClick
}) => {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-3xl bg-blue-900 border-4 border-white p-2 shadow-[20px_20px_0px_rgba(0,0,0,1)]">
                <div className="bg-white text-blue-900 p-2 mb-8 flex justify-between items-center font-bold text-2xl">
                    <span>*** SÜRPRİZ ***</span>
                    <button onClick={onClose} className="text-red-600 hover:bg-red-600 hover:text-white px-2">[X]</button>
                </div>

                {/* Wrapper prevents negative margin elements from clipping or looking bad */}
                {/* Wrapper prevents negative margin elements from clipping or looking bad */}
                <div className="px-4 py-2">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Card */}
                        <div className="w-full md:w-[320px] shrink-0 mx-auto">
                            <MovieCard
                                movie={movie}
                                onDelete={(id) => { onDelete(id); onClose(); }}
                                onMoveToWatched={(m) => { onMoveToWatched(m); onClose(); }}
                                onDirectorClick={(d) => { onDirectorClick(d); onClose(); }}
                                className="w-full shadow-lg"
                            />
                        </div>

                        {/* Right: Details (Restored) */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="bg-blue-800 p-4 border-2 border-white shadow-[8px_8px_0px_#000]">
                                <h3 className="text-yellow-400 font-bold mb-2 uppercase border-b border-blue-600 pb-1 flex items-center gap-2">
                                    <span>★</span> ÖZET
                                </h3>
                                <p className="text-white text-lg leading-relaxed font-serif">
                                    {movie.summary || "Özet bulunmuyor."}
                                </p>
                            </div>

                            {movie.userReview && (
                                <div className="bg-blue-950 p-4 border-2 border-cyan-400 shadow-[8px_8px_0px_#000]">
                                    <h3 className="text-cyan-400 font-bold mb-1 uppercase text-sm">İNCELEMEM</h3>
                                    <p className="text-xl text-white italic font-serif">
                                        "{movie.userReview}"
                                    </p>
                                </div>
                            )}


                        </div>
                    </div>
                </div>

                <button onClick={onTryAgain} className="w-full bg-cyan-400 text-black font-bold text-xl py-4 mt-8 hover:bg-white border-2 border-black">
                    TEKRAR DENE
                </button>
            </div>
        </div>
    );
};
