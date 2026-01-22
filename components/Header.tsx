import React, { useRef, useEffect } from 'react';
import { MovieStatus } from '../types';

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
    onMusicClick
}) => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchVisible) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isSearchVisible]);

    return (
        <div className="sticky top-0 z-50">
            <div className="bg-black border-b-2 border-white px-4 py-3 flex flex-wrap justify-between items-center text-xl sm:text-2xl font-bold gap-x-4 gap-y-2">

                {/* Logo Group */}
                <div className="flex items-center gap-1 mr-auto">
                    <span className="bg-white text-black px-2 font-bold">BENİM</span>
                    <span className="text-yellow-400 font-bold teletext-shadow">TV</span>
                </div>

                {/* Nav Group */}
                <div className="flex flex-wrap gap-2 sm:gap-4">
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

            {/* Collapsible Search Bar */}
            {/* Search Bar removed */}
        </div>
    );
};
