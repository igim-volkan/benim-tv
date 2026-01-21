import React, { useState } from 'react';
import { getMovieRecommendation } from '../services/geminiService';
import { Disc3, Loader2, Sparkles, Tv } from 'lucide-react';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchedMovies: string[];
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({ isOpen, onClose, watchedMovies }) => {
  const [recommendation, setRecommendation] = useState<{title: string, reason: string} | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRecommend = async () => {
    setLoading(true);
    setRecommendation(null);
    
    // Artificial delay for "processing" feel
    await new Promise(r => setTimeout(r, 1000));
    
    const result = await getMovieRecommendation(watchedMovies);
    setRecommendation(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-2xl bg-cyan-900 border-4 border-white p-1 shadow-[10px_10px_0px_#000]">
        
        {/* Header */}
        <div className="bg-white text-cyan-900 px-4 py-2 flex justify-between items-center font-bold text-2xl mb-4">
            <div className="flex items-center gap-2">
                <Disc3 className={loading ? "animate-spin" : ""} />
                <span>AI FILM GURMESI</span>
            </div>
            <button onClick={onClose} disabled={loading} className="hover:bg-cyan-900 hover:text-white px-2">[CIKIS]</button>
        </div>

        <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center gap-6 bg-black border-2 border-cyan-400 m-2">
            
            {!loading && !recommendation && (
                <div className="space-y-6">
                    <Tv size={64} className="mx-auto text-cyan-500" />
                    <div>
                        <p className="text-2xl text-white font-bold mb-2">NE IZLESEM?</p>
                        <p className="text-cyan-400 text-lg">
                            {watchedMovies.length > 0 
                                ? `${watchedMovies.length} ADET IZLEDIGINIZ FILM ANALIZ EDILECEK...`
                                : "HENUZ FILM IZLEMEDINIZ. GENEL ONERI ALINACAK."}
                        </p>
                    </div>
                    <button 
                        onClick={handleRecommend}
                        className="bg-yellow-400 text-black text-2xl font-bold px-8 py-4 hover:bg-white border-4 border-transparent hover:border-yellow-400 transition-all shadow-[4px_4px_0px_#333]"
                    >
                        [ ANALIZ ET VE ONER ]
                    </button>
                </div>
            )}

            {loading && (
                <div className="text-cyan-400 flex flex-col items-center animate-pulse">
                    <Loader2 className="animate-spin w-16 h-16 mb-6" />
                    <span className="text-2xl font-bold">VERITABANI TARANIYOR...</span>
                    <span className="text-sm mt-2">ZEVKLERINIZ COZUMLENIYOR</span>
                </div>
            )}

            {recommendation && !loading && (
                <div className="animate-in zoom-in duration-300 w-full">
                    <div className="border-b-4 border-dashed border-cyan-600 pb-4 mb-4">
                        <span className="text-yellow-400 text-lg font-bold">SIZIN ICIN SECILEN FILM:</span>
                        <h2 className="text-4xl md:text-5xl text-white font-black mt-2 leading-tight tracking-tighter shadow-black drop-shadow-lg">
                            {recommendation.title.toLocaleUpperCase('tr-TR')}
                        </h2>
                    </div>
                    
                    <div className="bg-cyan-900/50 p-4 border-l-4 border-yellow-400 text-left">
                        <p className="text-xl text-white font-bold leading-relaxed">
                            "{recommendation.reason}"
                        </p>
                    </div>

                    <button 
                        onClick={handleRecommend}
                        className="mt-8 text-cyan-400 hover:text-white underline decoration-2 underline-offset-4 font-bold"
                    >
                        BASKA BIR ONERI DAHA?
                    </button>
                </div>
            )}
        </div>
        
        <div className="text-center bg-cyan-900 text-white text-sm py-2 font-bold">
            *** YAPAY ZEKA DESTEKLI SINEMA SERVISI ***
        </div>
      </div>
    </div>
  );
};