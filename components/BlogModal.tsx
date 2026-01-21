import React from 'react';
import { Newspaper } from 'lucide-react';

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-4xl bg-blue-900 border-4 border-yellow-400 p-1 shadow-[10px_10px_0px_#fff]">

                {/* Header */}
                <div className="bg-yellow-400 text-blue-900 px-4 py-2 flex justify-between items-center font-bold text-2xl mb-4">
                    <div className="flex items-center gap-2">
                        <Newspaper />
                        <span>SİNEMA GÜNLÜĞÜ - SAYFA 600</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-blue-900 hover:text-white px-2">[ÇIKIŞ]</button>
                </div>

                <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center bg-black border-2 border-white">
                    <Newspaper className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
                    <h2 className="text-3xl text-white mb-2 blink">BLOG YAKINDA HİZMETİNİZDE</h2>
                    <p className="text-xl text-neutral-400">
                        FİLM ELEŞTİRİLERİ, LİSTELER VE DAHA FAZLASI İÇİN BEKLEMEDE KALIN.
                    </p>
                    <div className="mt-8 text-cyan-400 text-sm">
                        * * *
                    </div>
                </div>
            </div>
        </div>
    );
};
