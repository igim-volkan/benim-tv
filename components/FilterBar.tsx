import React from 'react';
import { X } from 'lucide-react';
import { MovieStatus } from '../types';

interface FilterBarProps {
    activeTab: MovieStatus;
    selectedGenre: string;
    setSelectedGenre: (val: string) => void;
    selectedDirector: string;
    setSelectedDirector: (val: string) => void;
    selectedYear: string;
    setSelectedYear: (val: string) => void;
    selectedRating: number | '';
    setSelectedRating: (val: number | '') => void;
    availableGenres: string[];
    availableDirectors: string[];
    availableYears: string[];
    sortOption: 'year_asc' | 'year_desc' | 'title_asc' | 'title_desc' | 'date_asc' | 'date_desc';
    setSortOption: (val: 'year_asc' | 'year_desc' | 'title_asc' | 'title_desc' | 'date_asc' | 'date_desc') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    activeTab,
    selectedGenre,
    setSelectedGenre,
    selectedDirector,
    setSelectedDirector,
    selectedYear,
    setSelectedYear,
    selectedRating,
    setSelectedRating,
    availableGenres,
    availableDirectors,
    availableYears,
    sortOption,
    setSortOption
}) => {
    return (
        <div className="mb-8 space-y-4">
            {/* Filters Row */}
            {activeTab !== 'watchlist' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="relative">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className={`w-full bg-black border-2 p-2 text-lg font-bold outline-none cursor-pointer rounded-none appearance-none text-center ${selectedGenre ? 'text-orange-400 border-orange-400' : 'text-cyan-400 border-cyan-400 hover:bg-cyan-900'}`}
                        >
                            <option value="">TÜM TÜRLER</option>
                            {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        {selectedGenre && (
                            <button
                                onClick={() => setSelectedGenre('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-white bg-black/50 rounded-full"
                                title="FİLTREYİ TEMİZLE"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <select
                            value={selectedDirector}
                            onChange={(e) => setSelectedDirector(e.target.value)}
                            className={`w-full bg-black border-2 p-2 text-lg font-bold outline-none cursor-pointer rounded-none appearance-none text-center ${selectedDirector ? 'text-orange-400 border-orange-400' : 'text-cyan-400 border-cyan-400 hover:bg-cyan-900'}`}
                        >
                            <option value="">YÖNETMENLER</option>
                            {availableDirectors.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        {selectedDirector && (
                            <button
                                onClick={() => setSelectedDirector('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-white bg-black/50 rounded-full"
                                title="FİLTREYİ TEMİZLE"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className={`w-full bg-black border-2 p-2 text-lg font-bold outline-none cursor-pointer rounded-none appearance-none text-center ${selectedYear ? 'text-orange-400 border-orange-400' : 'text-cyan-400 border-cyan-400 hover:bg-cyan-900'}`}
                        >
                            <option value="">YILLAR</option>
                            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        {selectedYear && (
                            <button
                                onClick={() => setSelectedYear('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-white bg-black/50 rounded-full"
                                title="FİLTREYİ TEMİZLE"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {activeTab === 'watched' && (
                        <div className="relative">
                            <select
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value === '' ? '' : Number(e.target.value))}
                                className={`w-full bg-black border-2 p-2 text-lg font-bold outline-none cursor-pointer rounded-none appearance-none text-center ${selectedRating !== '' ? 'text-orange-400 border-orange-400' : 'text-cyan-400 border-cyan-400 hover:bg-cyan-900'}`}
                            >
                                <option value="">PUANLAR</option>
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} YILDIZ</option>)}
                            </select>
                            {selectedRating !== '' && (
                                <button
                                    onClick={() => setSelectedRating('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-white bg-black/50 rounded-full"
                                    title="FİLTREYİ TEMİZLE"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Sorting Row */}
            <div className="flex justify-center gap-4 border-t border-neutral-800 pt-4">
                {activeTab !== 'watchlist' && (
                    <button
                        onClick={() => setSortOption(sortOption === 'year_desc' ? 'year_asc' : 'year_desc')}
                        className={`flex items-center gap-2 px-4 py-2 font-bold transition-colors ${sortOption.startsWith('year') ? 'text-yellow-400 bg-neutral-800' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <span>YIL</span>
                        <span className="text-xl">{sortOption === 'year_desc' ? '↓' : (sortOption === 'year_asc' ? '↑' : '↕')}</span>
                    </button>
                )}

                <button
                    onClick={() => setSortOption(sortOption === 'title_asc' ? 'title_desc' : 'title_asc')}
                    className={`flex items-center gap-2 px-4 py-2 font-bold transition-colors ${sortOption.startsWith('title') ? 'text-yellow-400 bg-neutral-800' : 'text-neutral-500 hover:text-white'}`}
                >
                    <span>İSİM</span>
                    <span className="text-xl">{sortOption === 'title_asc' ? '↓' : (sortOption === 'title_desc' ? '↑' : '↕')}</span>
                </button>

                <button
                    onClick={() => setSortOption(sortOption === 'date_desc' ? 'date_asc' : 'date_desc')}
                    className={`flex items-center gap-2 px-4 py-2 font-bold transition-colors ${sortOption.startsWith('date') ? 'text-yellow-400 bg-neutral-800' : 'text-neutral-500 hover:text-white'}`}
                >
                    <span>YÜKLENME</span>
                    <span className="text-xl">{sortOption === 'date_desc' ? '↓' : (sortOption === 'date_asc' ? '↑' : '↕')}</span>
                </button>
            </div>
        </div>
    );
};
