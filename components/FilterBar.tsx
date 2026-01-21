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
    availableYears
}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
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
    );
};
