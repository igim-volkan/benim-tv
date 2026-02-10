import React, { useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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
                        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Mission Statement Box */}
                            <div className="bg-neutral-900/50 p-6 border border-neutral-700/50 flex items-center justify-center">
                                <p className="text-cyan-400 font-bold text-center text-xl md:text-2xl leading-relaxed">
                                    "Burası bir veritabanı değil, bir filmseverin size sunduğu Dijital Bir Tavsiye Kutusudur."
                                </p>
                            </div>

                            {/* Ratings Box */}
                            <div className="bg-neutral-900/50 p-4 border border-neutral-700/50 text-base md:text-lg font-mono flex items-center">
                                <ul className="space-y-2 w-full">
                                    <li className="flex items-center gap-2"><span className="text-yellow-400 font-bold">5 YILDIZ</span> <span className="text-neutral-500">--&gt;</span> <span className="text-green-400">ÇOK İYİ OLUR.</span></li>
                                    <li className="flex items-center gap-2"><span className="text-yellow-400 font-bold">4 YILDIZ</span> <span className="text-neutral-500">--&gt;</span> <span className="text-cyan-400">İYİ OLUR.</span></li>
                                    <li className="flex items-center gap-2"><span className="text-yellow-400 font-bold">3 YILDIZ</span> <span className="text-neutral-500">--&gt;</span> <span className="text-neutral-400">HMMM.</span></li>
                                    <li className="flex items-center gap-2"><span className="text-yellow-400 font-bold">2 YILDIZ</span> <span className="text-neutral-500">--&gt;</span> <span className="text-orange-400">NİYE Kİ?</span></li>
                                    <li className="flex items-center gap-2"><span className="text-yellow-400 font-bold">1 YILDIZ</span> <span className="text-neutral-500">--&gt;</span> <span className="text-red-500 font-bold blink">SAKIIN.</span></li>
                                </ul>
                            </div>
                        </div>


                    </div>


                </div>
            </div>
        </div>
    );
};
