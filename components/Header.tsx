import React, { useRef, useEffect, useState } from 'react';
import { MovieStatus } from '../types';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
    activeTab: MovieStatus | 'admin';
    setActiveTab: (tab: MovieStatus | 'admin') => void;
    onSurpriseMe: () => void;
    isSearchVisible: boolean;
    toggleSearch: () => void;
    searchTerm: string;
    onSearchChange: (val: string) => void;
    onHoroscopeClick: () => void;
    onBlogClick: () => void;
    onMusicClick: () => void;
    // Mobile Menu Props
    onPatreonClick: () => void;
    onAddMovieClick: () => void;
    onLoginClick: () => void;
    onSuggestionClick: () => void;
    onAboutClick: () => void;
    isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    activeTab,
    setActiveTab,
    onSurpriseMe,
    isSearchVisible,
    toggleSearch,
    searchTerm,
    onSearchChange,
    onHoroscopeClick,
    onBlogClick,
    onMusicClick,
    onPatreonClick,
    onAddMovieClick,
    onLoginClick,
    onSuggestionClick,
    onAboutClick,
    isAdminLoggedIn
}) => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isSearchVisible) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isSearchVisible]);

    const handleMobileAction = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    };

    return (
        <div className="sticky top-0 z-50">
            <div className="bg-black border-b-2 border-white px-4 py-3 flex flex-wrap justify-between items-center text-xl sm:text-2xl font-bold gap-x-4 gap-y-2 relative">

                {/* Logo Group */}
                <div className="flex items-center gap-1 mr-auto">
                    <span className="bg-white text-black px-2 font-bold">BENİM</span>
                    <span className="text-yellow-400 font-bold teletext-shadow">TV</span>
                    <span className="text-red-500 text-xs border border-red-500 px-1 ml-1 self-start">TEST</span>
                </div>

                {/* Hamburger Button (Mobile Only) */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-white hover:text-yellow-400"
                >
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>

                {/* Desktop Nav Group */}
                <div className="hidden md:flex flex-wrap gap-2 sm:gap-4">
                    <button
                        onClick={() => setActiveTab('watched')}
                        className={`hover:bg-white hover:text-black px-2 ${activeTab === 'watched' ? 'text-yellow-400' : 'text-neutral-500'}`}
                    >
                        100 KOLEKSİYON
                    </button>
                    <button
                        onClick={() => setActiveTab('watchlist')}
                        className={`hover:bg-white hover:text-black px-2 ${activeTab === 'watchlist' ? 'text-green-400' : 'text-neutral-500'}`}
                    >
                        200 LİSTE
                    </button>
                    <button
                        onClick={onSurpriseMe}
                        className="text-cyan-400 hover:bg-white hover:text-black px-2"
                    >
                        300 ŞANS
                    </button>
                    {/* Search Button removed */}
                    <button
                        onClick={onHoroscopeClick}
                        className="text-purple-400 hover:bg-white hover:text-black px-2"
                    >
                        400 HOROSCOPE
                    </button>
                    <button
                        onClick={onBlogClick}
                        className="text-blue-400 hover:bg-white hover:text-black px-2"
                    >
                        500 BLOG
                    </button>
                    <button
                        onClick={onMusicClick}
                        className="text-pink-400 hover:bg-white hover:text-black px-2"
                    >
                        600 MÜZİK
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-[60px] bg-black/95 z-40 flex flex-col p-4 gap-4 overflow-y-auto pb-20 border-t-2 border-white md:hidden">
                    <div className="grid grid-cols-1 gap-4 text-center text-2xl">
                        <button onClick={() => handleMobileAction(() => setActiveTab('watched'))} className="text-yellow-400 border-2 border-white py-3 hover:bg-white hover:text-black">100 KOLEKSİYON</button>
                        <button onClick={() => handleMobileAction(() => setActiveTab('watchlist'))} className="text-green-400 border-2 border-white py-3 hover:bg-white hover:text-black">200 LİSTE</button>
                        <button onClick={() => handleMobileAction(onSurpriseMe)} className="text-cyan-400 border-2 border-white py-3 hover:bg-white hover:text-black">300 ŞANS</button>
                        <button onClick={() => handleMobileAction(onHoroscopeClick)} className="text-purple-400 border-2 border-white py-3 hover:bg-white hover:text-black">400 HOROSCOPE</button>
                        <button onClick={() => handleMobileAction(onBlogClick)} className="text-blue-400 border-2 border-white py-3 hover:bg-white hover:text-black">500 BLOG</button>
                        <button onClick={() => handleMobileAction(onMusicClick)} className="text-pink-400 border-2 border-white py-3 hover:bg-white hover:text-black">600 MÜZİK</button>

                        <div className="h-px bg-white/30 my-2"></div>

                        <button onClick={() => handleMobileAction(onPatreonClick)} className="border-2 border-cyan-400 text-cyan-400 py-3 hover:bg-cyan-400 hover:text-black font-bold">[ BİR FİLM ISMARLA ]</button>
                        <button onClick={() => handleMobileAction(onAddMovieClick)} className="border-2 border-yellow-400 text-yellow-400 py-3 hover:bg-yellow-400 hover:text-black font-bold">[ + YENİ KAYIT ]</button>
                        <button onClick={() => handleMobileAction(toggleSearch)} className="border-2 border-white text-white py-3 hover:bg-white hover:text-black">ARAMA</button>

                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleMobileAction(onSuggestionClick)} className="border-2 border-white text-white py-3 hover:bg-white hover:text-black">ÖF</button>
                            <button onClick={() => handleMobileAction(onLoginClick)} className={`border-2 border-white text-white py-3 hover:bg-white hover:text-black ${isAdminLoggedIn ? 'text-red-500 border-red-500' : ''}`}>{isAdminLoggedIn ? 'ÇIKIŞ' : 'GİRİŞ'}</button>
                            <button onClick={() => handleMobileAction(onAboutClick)} className="border-2 border-white text-white py-3 hover:bg-white hover:text-black">?</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsible Search Bar */}
            {/* Search Bar removed */}
        </div>
    );
};
