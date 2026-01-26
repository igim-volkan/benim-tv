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
            <div className="w-full max-w-4xl bg-purple-900 border-4 border-yellow-400 p-1 shadow-[10px_10px_0px_#fff] overflow-y-auto max-h-[90vh]">

                {/* Header */}
                <div className="bg-yellow-400 text-purple-900 px-4 py-2 flex justify-between items-center font-bold text-lg md:text-2xl mb-4 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} />
                        <span>ASTRO SİNEMA</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-purple-900 hover:text-white px-2">[ÇIKIŞ]</button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 p-2 md:p-4">
                    {/* Sign Grid */}
                    <div className="grid grid-cols-3 gap-2 w-full md:w-1/2 shrink-0">
                        {SIGNS.map(sign => (
                            <button
                                key={sign}
                                onClick={() => handleSignClick(sign)}
                                disabled={loading}
                                className={`p-2 md:p-3 text-sm md:text-xl font-bold border-2 transition-all text-center
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
                    <div className="w-full md:w-1/2 bg-black border-2 border-white p-4 md:p-6 flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px] text-center relative overflow-hidden">
                        {!selectedSign && (
                            <div className="text-neutral-500 animate-pulse">
                                <p className="text-xl md:text-2xl mb-2">LÜTFEN BURCUNUZU SEÇİNİZ</p>
                                <p>---</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-yellow-400 flex flex-col items-center z-10">
                                <Loader2 className="animate-spin w-10 h-10 md:w-12 md:h-12 mb-4" />
                                <span className="text-lg md:text-xl blink">YILDIZLAR OKUNUYOR...</span>
                            </div>
                        )}

                        {recommendedMovie && !loading && (
                            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center w-full h-full justify-between">
                                <h3 className="text-lg md:text-2xl text-cyan-400 mb-2 border-b-2 border-cyan-400">
                                    {selectedSign} İÇİN ÖNERİ:
                                </h3>

                                {recommendedMovie.posterBase64 && (
                                    <img
                                        src={recommendedMovie.posterBase64}
                                        alt={recommendedMovie.title}
                                        className="w-24 h-36 md:w-32 md:h-48 object-cover border-2 border-white mb-4 shadow-[4px_4px_0px_#333]"
                                    />
                                )}

                                <h2 className="text-2xl md:text-3xl text-yellow-400 font-bold mb-2 break-words max-w-full leading-none">
                                    {recommendedMovie.title}
                                </h2>

                                <div className="text-purple-400 text-xs md:text-sm mt-auto font-bold uppercase">
                                    YIL: {recommendedMovie.year} | {recommendedMovie.director}
                                </div>
                            </div>
                        )}

                        {selectedSign && !loading && !recommendedMovie && (
                            <div className="text-red-500 text-lg md:text-xl font-bold">
                                MALESEF KOLEKSIYONDA FILM BULUNAMADI.
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center text-yellow-400 text-sm md:text-lg mt-2 pb-2 px-2">
                    *** GELECEĞİNİZ BİR FİLM SENARYOSU KADAR SÜRPRİZLİ OLABİLİR ***
                </div>
            </div>
        </div>
    );
};