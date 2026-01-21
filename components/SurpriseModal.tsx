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
                <div className="px-4 py-2">
                    <MovieCard
                        movie={movie}
                        onDelete={(id) => { onDelete(id); onClose(); }}
                        onMoveToWatched={(m) => { onMoveToWatched(m); onClose(); }}
                        onDirectorClick={(d) => { onDirectorClick(d); onClose(); }}
                        className="w-full"
                    />
                </div>

                <button onClick={onTryAgain} className="w-full bg-cyan-400 text-black font-bold text-xl py-4 mt-8 hover:bg-white border-2 border-black">
                    TEKRAR DENE
                </button>
            </div>
        </div>
    );
};
