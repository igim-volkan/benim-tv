import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { MovieEntry } from '../types';

interface HoroscopeModalProps {
    isOpen: boolean;
    onClose: () => void;
    movies: MovieEntry[];
}

const SIGNS = [
    "KOÇ", "BOĞA", "İKİZLER", "YENGEÇ",
    "ASLAN", "BAŞAK", "TERAZİ", "AKREP",
    "YAY", "OĞLAK", "KOVA", "BALIK"
];

export const HoroscopeModal: React.FC<HoroscopeModalProps> = ({ isOpen, onClose, movies }) => {
    const [selectedSign, setSelectedSign] = useState<string | null>(null);
    const [recommendedMovie, setRecommendedMovie] = useState<MovieEntry | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSignClick = async (sign: string) => {
        setSelectedSign(sign);
        setLoading(true);
        setRecommendedMovie(null);

        // Simulate "reading stars" delay
        setTimeout(() => {
            const watchedMovies = movies.filter(m => m.status === 'watched' && m.isApproved !== false);

            if (watchedMovies.length > 0) {
                const random = watchedMovies[Math.floor(Math.random() * watchedMovies.length)];
                setRecommendedMovie(random);
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-4xl bg-purple-900 border-4 border-yellow-400 p-1 shadow-[10px_10px_0px_#fff]">

                {/* Header */}
                <div className="bg-yellow-400 text-purple-900 px-4 py-2 flex justify-between items-center font-bold text-2xl mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles />
                        <span>ASTRO SİNEMA - SAYFA 500</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-purple-900 hover:text-white px-2">[ÇIKIŞ]</button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 p-4">
                    {/* Sign Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full md:w-1/2">
                        {SIGNS.map(sign => (
                            <button
                                key={sign}
                                onClick={() => handleSignClick(sign)}
                                disabled={loading}
                                className={`p-3 text-xl font-bold border-2 transition-all text-center
                            ${selectedSign === sign
                                        ? 'bg-white text-purple-900 border-white blink'
                                        : 'bg-purple-800 text-yellow-400 border-purple-600 hover:border-yellow-400 hover:bg-purple-700'
                                    }`}
                            >
                                {sign}
                            </button>
                        ))}
                    </div>

                    {/* Prediction Area */}
                    <div className="w-full md:w-1/2 bg-black border-2 border-white p-6 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden">
                        {!selectedSign && (
                            <div className="text-neutral-500 animate-pulse">
                                <p className="text-2xl mb-2">LÜTFEN BURCUNUZU SEÇİNİZ</p>
                                <p>---</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-yellow-400 flex flex-col items-center z-10">
                                <Loader2 className="animate-spin w-12 h-12 mb-4" />
                                <span className="text-xl blink">YILDIZLAR OKUNUYOR...</span>
                            </div>
                        )}

                        {recommendedMovie && !loading && (
                            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center w-full h-full justify-between">
                                <h3 className="text-2xl text-cyan-400 mb-2 border-b-2 border-cyan-400">
                                    {selectedSign} İÇİN ÖNERİ:
                                </h3>

                                {recommendedMovie.posterBase64 && (
                                    <img
                                        src={recommendedMovie.posterBase64}
                                        alt={recommendedMovie.title}
                                        className="w-32 h-48 object-cover border-2 border-white mb-4 shadow-[4px_4px_0px_#333]"
                                    />
                                )}

                                <h2 className="text-3xl text-yellow-400 font-bold mb-2 break-words max-w-full">
                                    {recommendedMovie.title}
                                </h2>

                                <div className="text-white text-lg line-clamp-3 mb-2">
                                    {recommendedMovie.summary || "Ozet yok."}
                                </div>

                                <div className="text-purple-400 text-sm mt-auto">
                                    YIL: {recommendedMovie.year} | {recommendedMovie.director}
                                </div>
                            </div>
                        )}

                        {selectedSign && !loading && !recommendedMovie && (
                            <div className="text-red-500 text-xl font-bold">
                                MALESEF KOLEKSIYONDA FILM BULUNAMADI.
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center text-yellow-400 text-lg mt-2 pb-2">
                    *** GELECEĞİNİZ BİR FİLM SENARYOSU KADAR SÜRPRİZLİ OLABİLİR ***
                </div>
            </div>
        </div>
    );
};