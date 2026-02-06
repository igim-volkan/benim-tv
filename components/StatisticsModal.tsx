import React, { useMemo, useEffect } from 'react';
import { X, BarChart3, Trophy, Calendar, Video, Star, ThumbsDown, Clapperboard } from 'lucide-react';
import { MovieEntry } from '../types';

interface StatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    movies: MovieEntry[];
}

export function StatisticsModal({ isOpen, onClose, movies }: StatisticsModalProps) {
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

    const stats = useMemo(() => {
        const watchedMovies = movies.filter(m => m.status === 'watched');
        const watchedCount = watchedMovies.length;
        const watchlistCount = movies.filter(m => m.status === 'watchlist').length;

        // 1. Most 5-Star Movies Year
        const fiveStarMovies = watchedMovies.filter(m => (m.userRating || 0) === 5);
        const yearCounts: Record<string, number> = {};

        fiveStarMovies.forEach(m => {
            if (m.year) {
                // Extract year if it's like "2023-..." or just use as is
                const y = m.year.toString().substring(0, 4);
                yearCounts[y] = (yearCounts[y] || 0) + 1;
            }
        });

        // Calculate Top 5 Years
        const topYears = Object.entries(yearCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([year, count]) => ({ year, count }));

        // 2. Best Director (Most 4 & 5 Star Movies)
        const highRatedMovies = watchedMovies.filter(m => (m.userRating || 0) >= 4);
        const directorCounts: Record<string, number> = {};

        highRatedMovies.forEach(m => {
            if (m.director && m.director !== 'Bilinmiyor') {
                const dirs = Array.isArray(m.director) ? m.director : [m.director];
                dirs.forEach(d => {
                    const trimmed = d.toString().trim();
                    directorCounts[trimmed] = (directorCounts[trimmed] || 0) + 1;
                });
            }
        });

        // Calculate Top 5 Directors
        const topDirectors = Object.entries(directorCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // 3. Most Watched Director (Quantity)
        const mostWatchedDirectorCounts: Record<string, number> = {};
        watchedMovies.forEach(m => {
            if (m.director && m.director !== 'Bilinmiyor') {
                const dirs = Array.isArray(m.director) ? m.director : [m.director];
                dirs.forEach(d => {
                    const trimmed = d.toString().trim();
                    mostWatchedDirectorCounts[trimmed] = (mostWatchedDirectorCounts[trimmed] || 0) + 1;
                });
            }
        });

        let quantityDirector = "-";
        let quantityDirectorCount = 0;
        Object.entries(mostWatchedDirectorCounts).forEach(([director, count]) => {
            if (count > quantityDirectorCount) {
                quantityDirectorCount = count;
                quantityDirector = director;
            }
        });

        // 4. Worst Year (Lowest Average Rating - min 2 movies)
        const yearRatings: Record<string, { total: number, count: number }> = {};
        watchedMovies.forEach(m => {
            if (m.year && m.userRating) {
                const y = m.year.toString().substring(0, 4);
                if (!yearRatings[y]) yearRatings[y] = { total: 0, count: 0 };
                yearRatings[y].total += m.userRating;
                yearRatings[y].count += 1;
            }
        });

        let worstYear = "-";
        let worstAvg = 10; // Start high

        Object.entries(yearRatings).forEach(([year, data]) => {
            if (data.count >= 2) { // Minimum 2 movies to qualify
                const avg = data.total / data.count;
                if (avg < worstAvg) {
                    worstAvg = avg;
                    worstYear = year;
                }
            }
        });

        if (worstYear === "-" && Object.keys(yearRatings).length > 0) {
            Object.entries(yearRatings).forEach(([year, data]) => {
                const avg = data.total / data.count;
                if (avg < worstAvg) {
                    worstAvg = avg;
                    worstYear = year;
                }
            });
        }
        if (worstYear === "-") worstAvg = 0;


        // 5. Most Watched Genre
        const genreCounts: Record<string, number> = {};
        watchedMovies.forEach(m => {
            if (m.genre) {
                const genres = Array.isArray(m.genre) ? m.genre : [m.genre];
                genres.forEach(g => {
                    if (typeof g === 'string') {
                        genreCounts[g] = (genreCounts[g] || 0) + 1;
                    }
                });
            }
        });

        let topGenre = "-";
        let topGenreCount = 0;
        Object.entries(genreCounts).forEach(([genre, count]) => {
            if (count > topGenreCount) {
                topGenreCount = count;
                topGenre = genre;
            }
        });


        // 6. Most Watched Year (New)
        const allYearCounts: Record<string, number> = {};
        watchedMovies.forEach(m => {
            if (m.year) {
                const y = m.year.toString().substring(0, 4);
                allYearCounts[y] = (allYearCounts[y] || 0) + 1;
            }
        });

        let mostWatchedYear = "-";
        let mostWatchedYearCount = 0;
        Object.entries(allYearCounts).forEach(([year, count]) => {
            if (count > mostWatchedYearCount) {
                mostWatchedYearCount = count;
                mostWatchedYear = year;
            }
        });

        // 7. Total Watch Time (New)
        // Avg 1.5 hours (90 mins) per movie
        const totalWatchHours = (watchedCount * 1.5).toFixed(1);

        return {
            watchedCount,
            watchlistCount,
            topYears,
            topDirectors,
            quantityDirector,
            quantityDirectorCount,
            worstYear,
            worstAvg: worstAvg === 10 ? 0 : worstAvg.toFixed(1),
            topGenre,
            topGenreCount,
            mostWatchedYear,
            mostWatchedYearCount,
            totalWatchHours
        };
    }, [movies]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-neutral-900 border-4 border-white w-full max-w-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-blue-800 text-white p-4 flex justify-between items-center border-b-4 border-white">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-yellow-400" />
                        <h2 className="text-3xl font-black tracking-widest teletext-shadow">
                            İSTATİSTİKLER
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-500 text-white p-2 transition-colors border-2 border-transparent hover:border-white"
                    >
                        <X size={32} strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8 space-y-6 md:space-y-8 font-mono overflow-y-auto custom-scrollbar flex-1">

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">



                        {/* Most Watched Year (New) */}
                        <div className="bg-black border-2 border-orange-500 p-6 relative group hover:bg-neutral-900 transition-colors">
                            <h3 className="text-orange-400 text-lg mb-2 mt-2">EN ÇOK İZLENEN YIL</h3>
                            <div className="text-5xl font-bold text-white mb-2">{stats.mostWatchedYear}</div>
                            <div className="text-neutral-500 text-sm">{stats.mostWatchedYearCount} FİLM İZLEDİN</div>
                        </div>

                        {/* Most Watched Director */}
                        <div className="bg-black border-2 border-cyan-500 p-6 relative group hover:bg-neutral-900 transition-colors">
                            <h3 className="text-white text-lg mb-2 mt-2">EN ÇOK İZLENEN YÖNETMEN</h3>
                            <div className="text-3xl font-bold text-cyan-400 mb-2 line-clamp-2 truncate">
                                {stats.quantityDirector}
                            </div>
                            <div className="text-neutral-500 text-sm">{stats.quantityDirectorCount} FİLMİNİ İZLEDİN</div>
                        </div>

                        {/* Best Year */}
                        <div className="bg-black border-2 border-yellow-400 p-6 relative group hover:bg-neutral-900 transition-colors">
                            <h3 className="text-cyan-400 text-lg mb-2 mt-2">EN ÇOK 5★ FİLM YILI</h3>

                            {/* 1. Year */}
                            <div className="text-5xl font-bold text-white mb-2">{stats.topYears[0]?.year || "-"}</div>
                            <div className="text-neutral-500 text-sm mb-4">{stats.topYears[0]?.count || 0} ADET 5 YILDIZLI FİLM</div>

                            {/* 2-5 Years */}
                            {stats.topYears.length > 1 && (
                                <div className="border-t border-neutral-700 pt-3 flex flex-col gap-1">
                                    {stats.topYears.slice(1).map((y, i) => (
                                        <div key={i} className="flex justify-between items-center text-lg font-bold">
                                            <span className="text-neutral-300 truncate pr-2">{y.year}</span>
                                            <span className="text-yellow-400">{y.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Best Director */}
                        <div className="bg-black border-2 border-green-500 p-6 relative group hover:bg-neutral-900 transition-colors">
                            <h3 className="text-yellow-400 text-lg mb-2 mt-2">YILDIZLARIN YÖNETMENİ</h3>

                            {/* 1. Director */}
                            <div className="text-4xl font-bold text-white mb-1 line-clamp-1 truncate">
                                {stats.topDirectors[0]?.name || "-"}
                            </div>
                            <div className="text-neutral-500 text-sm mb-4">
                                {stats.topDirectors[0]?.count || 0} ADET 4+ YILDIZLI FİLM
                            </div>

                            {/* 2. & 3. Directors */}
                            {stats.topDirectors.length > 1 && (
                                <div className="border-t border-neutral-700 pt-3 flex flex-col gap-1">
                                    {stats.topDirectors.slice(1).map((d, i) => (
                                        <div key={i} className="flex justify-between items-center text-lg font-bold">
                                            <span className="text-neutral-300 truncate pr-2">{d.name}</span>
                                            <span className="text-green-500">{d.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Worst Year */}
                        <div className="bg-black border-2 border-red-800 p-6 relative group hover:bg-neutral-900 transition-colors">
                            <h3 className="text-red-500 text-lg mb-2 mt-2">EN BERBAT YIL</h3>
                            <div className="text-4xl font-bold text-white mb-2">{stats.worstYear}</div>
                            <div className="text-neutral-500 text-sm">ORTALAMA PUAN: {stats.worstAvg}</div>
                        </div>

                        {/* Top Genre */}
                        <div className="bg-black border-2 border-purple-500 p-6 relative group hover:bg-neutral-900 transition-colors">
                            <h3 className="text-green-400 text-lg mb-2 mt-2">FAVORİ TÜR</h3>
                            <div className="text-4xl font-bold text-white mb-2">{stats.topGenre}</div>
                            <div className="text-neutral-500 text-sm">{stats.topGenreCount} ADET İZLENEN</div>
                        </div>

                        {/* Total Watch Time (New) */}
                        <div className="bg-black border-2 border-blue-500 p-6 relative group hover:bg-neutral-900 transition-colors">
                            <h3 className="text-blue-400 text-lg mb-2 mt-2">TOPLAM İZLEME SÜRESİ</h3>
                            <div className="text-4xl font-bold text-white mb-2">{stats.totalWatchHours} SAAT</div>
                            <div className="text-neutral-500 text-sm">ORTALAMA 1.5 SAAT / FİLM</div>
                        </div>

                        {/* Total Counts */}
                        <div className="bg-black border-2 border-red-500 p-6 relative group hover:bg-neutral-900 transition-colors flex flex-col justify-center">
                            <div className="flex justify-between items-center border-b border-neutral-800 pb-2 mb-2">
                                <span className="text-neutral-400">İZLENEN</span>
                                <span className="text-2xl text-white font-bold">{stats.watchedCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">LİSTEM</span>
                                <span className="text-2xl text-white font-bold">{stats.watchlistCount}</span>
                            </div>
                        </div>

                    </div>

                    {/* Footer Message */}
                    <div className="text-center border-t-2 border-neutral-800 pt-6">
                        <p className="text-yellow-400 text-sm blink">
                            * VERİLER SÜREKLİ GÜNCELLENMEKTEDİR *
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
