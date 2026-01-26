import React from 'react';
import { HelpCircle } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    watchedCount: number;
    watchlistCount: number;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, watchedCount, watchlistCount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-3xl bg-neutral-900 border-4 border-white p-1 shadow-[10px_10px_0px_#000] overflow-y-auto max-h-[90vh]">

                {/* Header */}
                <div className="bg-white text-black px-4 py-2 flex justify-between items-center font-bold text-lg md:text-2xl mb-1 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <HelpCircle size={24} />
                        <span>HAKKINDA</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-black hover:text-white px-2 transition-colors">[X]</button>
                </div>

                {/* Content */}
                <div className="bg-black border-2 border-neutral-700 p-4 md:p-8 text-white min-h-[300px] md:min-h-[400px] flex flex-col justify-center">
                    <h2 className="text-2xl md:text-4xl text-yellow-400 font-bold mb-4 md:mb-6 leading-tight md:leading-none tracking-wide border-b-4 border-blue-600 inline-block pb-2">
                        SPEND YOUR TIME WATCHING GREAT MOVIES,<br />
                        NOT SEARCHING FOR THEM.
                    </h2>

                    <div className="space-y-3 md:space-y-4 text-lg md:text-2xl font-medium leading-relaxed text-neutral-300">
                        <p>
                            Kötü bir filme harcanan iki saat, geri gelmeyecek bir zamandır.
                            <span className="text-white"> Ben bu zamanı sizin yerinize harcadım!</span> Bu platform, izlediğim yüzlerce film arasından süzülüp gelen bir öneri rehberidir.
                        </p>
                        <p>
                            Puan tablolarıma göz atarak hangi filmin izlemeye değer olduğunu görebilir, kişisel eleştirilerimle film hakkında ön bilgi edinebilirsiniz.
                        </p>
                        <p className="text-cyan-400 font-bold mt-2 md:mt-4">
                            Burası bir veritabanı değil, bir filmseverin size sunduğu dijital bir tavsiye kutusudur.
                        </p>

                        <div className="mt-6 md:mt-8 border-t-2 border-neutral-800 pt-4 md:pt-6 flex flex-wrap gap-4 md:gap-8 justify-center font-mono text-base md:text-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 font-bold text-lg md:text-xl">100</span>
                                <span className="text-white">İZLENEN</span>
                                <span className="text-yellow-400 font-bold text-xs md:text-sm bg-neutral-900 px-2 py-1 border border-neutral-700 ml-1">
                                    {watchedCount} FİLM
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 font-bold text-lg md:text-xl">200</span>
                                <span className="text-white">İZLENECEK</span>
                                <span className="text-yellow-400 font-bold text-xs md:text-sm bg-neutral-900 px-2 py-1 border border-neutral-700 ml-1">
                                    {watchlistCount} FİLM
                                </span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};
