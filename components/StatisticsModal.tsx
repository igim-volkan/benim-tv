import React, { useMemo, useEffect } from 'react';
import { X, BarChart3, Trophy, Calendar, Video, Star, ThumbsDown, Clapperboard, PieChart as PieIcon, Hourglass } from 'lucide-react';
import { MovieEntry } from '../types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';

interface StatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    movies: MovieEntry[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#3b82f6']; // Red to Greenish
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

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
                const y = m.year.toString().substring(0, 4);
                yearCounts[y] = (yearCounts[y] || 0) + 1;
            }
        });

        // 2. Directors Analysis
        const directorCounts: Record<string, number> = {}; // High rated
        const mostWatchedDirectorCounts: Record<string, number> = {}; // All watched
        const directorStats: Record<string, { totalRating: number, count: number }> = {}; // For average calc

        watchedMovies.forEach(m => {
            if (m.director && m.director !== 'Bilinmiyor') {
                const dirs = Array.isArray(m.director) ? m.director : [m.director];
                dirs.forEach(d => {
                    const trimmed = d.toString().trim();
                    // Most Watched
                    mostWatchedDirectorCounts[trimmed] = (mostWatchedDirectorCounts[trimmed] || 0) + 1;

                    // High Rated (4+)
                    if ((m.userRating || 0) >= 4) {
                        directorCounts[trimmed] = (directorCounts[trimmed] || 0) + 1;
                    }

                    // Average Stats
                    if (m.userRating) {
                        if (!directorStats[trimmed]) directorStats[trimmed] = { totalRating: 0, count: 0 };
                        directorStats[trimmed].totalRating += m.userRating;
                        directorStats[trimmed].count += 1;
                    }
                });
            }
        });

        // Top Rated Directors
        const topDirectors = Object.entries(directorCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([name, count]) => {
                const stats = directorStats[name];
                const avg = stats ? (stats.totalRating / stats.count).toFixed(1) : "0.0";
                return { name, count, avg };
            });

        // Most Watched Directors (Top 3)
        const mostWatchedDirectors = Object.entries(mostWatchedDirectorCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([name, count]) => {
                const stats = directorStats[name];
                const avg = stats ? (stats.totalRating / stats.count).toFixed(1) : "0.0";
                return { name, count, avg };
            });

        // Total Directors Count
        const totalDirectors = Object.keys(mostWatchedDirectorCounts).length;

        // 3. Worst Year & Decade Analysis
        const yearRatings: Record<string, { total: number, count: number }> = {};
        const decadeStats: Record<string, { totalRating: number, count: number }> = {};

        watchedMovies.forEach(m => {
            if (m.year && m.userRating) {
                const yearStr = m.year.toString().substring(0, 4);
                const yearNum = parseInt(yearStr);

                // Year Stats
                if (!yearRatings[yearStr]) yearRatings[yearStr] = { total: 0, count: 0 };
                yearRatings[yearStr].total += m.userRating;
                yearRatings[yearStr].count += 1;

                // Decade Stats
                if (!isNaN(yearNum)) {
                    const decade = Math.floor(yearNum / 10) * 10;
                    const decadeKey = `${decade}-${decade + 9}`;
                    if (!decadeStats[decadeKey]) decadeStats[decadeKey] = { totalRating: 0, count: 0 };
                    decadeStats[decadeKey].totalRating += m.userRating;
                    decadeStats[decadeKey].count += 1;
                }
            }
        });

        // Worst Year Calculation
        let worstYear = "-";
        let worstAvg = 10;
        Object.entries(yearRatings).forEach(([year, data]) => {
            if (data.count >= 2) {
                const avg = data.total / data.count;
                if (avg < worstAvg) {
                    worstAvg = avg;
                    worstYear = year;
                }
            }
        });
        if (worstYear === "-" && Object.keys(yearRatings).length > 0) {
            // Fallback if no year has >= 2 movies
            Object.entries(yearRatings).forEach(([year, data]) => {
                const avg = data.total / data.count;
                if (avg < worstAvg) {
                    worstAvg = avg;
                    worstYear = year;
                }
            });
        }
        if (worstYear === "-") worstAvg = 0;

        // Decade Analysis Calculation
        let bestDecade = "-";
        let bestDecadeAvg = 0;
        let bestDecadeCount = 0;
        Object.entries(decadeStats).forEach(([decade, data]) => {
            if (data.count >= 3) { // Minimum 3 movies for a decade to qualify as "Golden Age"
                const avg = data.totalRating / data.count;
                if (avg > bestDecadeAvg) {
                    bestDecadeAvg = avg;
                    bestDecade = decade;
                    bestDecadeCount = data.count;
                }
            }
        });




        // 4. Genre Analysis
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
        const genreData = Object.entries(genreCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        let topGenre = genreData.length > 0 ? genreData[0].name : "-";
        let topGenreCount = genreData.length > 0 ? genreData[0].value : 0;


        // 5. Year Distribution & Most Watched Year
        const allYearCounts: Record<string, number> = {};
        watchedMovies.forEach(m => {
            if (m.year) {
                const y = m.year.toString().substring(0, 4);
                allYearCounts[y] = (allYearCounts[y] || 0) + 1;
            }
        });
        const yearDistributionData = Object.entries(allYearCounts)
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => parseInt(a.year) - parseInt(b.year));

        let mostWatchedYear = "-";
        let mostWatchedYearCount = 0;
        Object.entries(allYearCounts).forEach(([year, count]) => {
            if (count > mostWatchedYearCount) {
                mostWatchedYearCount = count;
                mostWatchedYear = year;
            }
        });

        const topWatchedYears = Object.entries(allYearCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([year, count]) => {
                const data = yearRatings[year];
                const avg = data ? (data.total / data.count).toFixed(1) : "0.0";
                return { year, count, avg };
            });

        // 6. Top High Rated Years (4+ Stars)
        const highRatedYearCounts: Record<string, number> = {};
        watchedMovies.forEach(m => {
            if (m.year && (m.userRating || 0) >= 4) {
                const y = m.year.toString().substring(0, 4);
                highRatedYearCounts[y] = (highRatedYearCounts[y] || 0) + 1;
            }
        });
        const topHighRatedYears = Object.entries(highRatedYearCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([year, count]) => {
                const data = yearRatings[year];
                const avg = data ? (data.total / data.count).toFixed(1) : "0.0";
                return { year, count, avg };
            });

        // 7. Total Watch Time
        const totalHours = watchedCount * 1.75;
        const totalWatchHours = totalHours.toFixed(1);
        const totalWatchDays = (totalHours / 24).toFixed(1);

        // 7. Rating Distribution (For Pie Chart)
        const ratingCounts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
        watchedMovies.forEach(m => {
            if (m.userRating) {
                ratingCounts[m.userRating.toString()] = (ratingCounts[m.userRating.toString()] || 0) + 1;
            }
        });
        // Filter out zero counts to look cleaner on Pie
        const ratingData = Object.entries(ratingCounts)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name: `${name} ★`, value }));

        // 8. Global Average Rating
        let totalRatingSum = 0;
        let ratedMovieCount = 0;
        watchedMovies.forEach(m => {
            if (m.userRating) {
                totalRatingSum += m.userRating;
                ratedMovieCount++;
            }
        });
        const globalAverageRating = ratedMovieCount > 0 ? (totalRatingSum / ratedMovieCount).toFixed(1) : "0.0";

        // 9. Average Movies Per Year (Range Based)
        let minYear = 9999;
        let maxYear = 0;
        watchedMovies.forEach(m => {
            if (m.year) {
                const y = parseInt(m.year.toString().substring(0, 4));
                if (!isNaN(y)) {
                    if (y < minYear) minYear = y;
                    if (y > maxYear) maxYear = y;
                }
            }
        });

        let avgMoviesPerYear = "0";
        if (watchedCount > 0 && maxYear >= minYear) {
            const yearRange = maxYear - minYear;
            // If range is 0 (all movies in same year), we can either decide to divide by 1 or handle specially. 
            // Logic: if range is 0, it means 1 year. So average is count/1.
            const divisor = yearRange === 0 ? 1 : yearRange;
            avgMoviesPerYear = (watchedCount / divisor).toFixed(1);
        }

        // 10. Most Watched Year Frequency
        let mostWatchedYearFrequency = "0";
        if (mostWatchedYearCount > 0) {
            // 365 days / movie count
            mostWatchedYearFrequency = (365 / mostWatchedYearCount).toFixed(1);
        }


        return {
            watchedCount,
            watchlistCount,
            topDirectors,
            mostWatchedDirectors,
            worstYear,
            worstAvg: worstAvg === 10 ? 0 : worstAvg.toFixed(1),
            topGenre,
            topGenreCount,
            genreData,
            mostWatchedYear,
            mostWatchedYearCount,
            yearDistributionData,
            topWatchedYears,
            topHighRatedYears,
            totalWatchHours,
            totalWatchDays,
            ratingData,
            globalAverageRating,
            ratedMovieCount,
            bestDecade,
            bestDecadeAvg: bestDecadeAvg.toFixed(1),
            bestDecadeCount,
            totalDirectors,
            // New Stats
            minYear,
            maxYear,
            avgMoviesPerYear,
            mostWatchedYearFrequency
        };
    }, [movies]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[20000] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-neutral-900 border-4 border-white w-full max-w-5xl shadow-[0_0_50px_rgba(255,255,255,0.1)] flex flex-col max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Solid Color, No Radius */}
                <div className="bg-blue-900 text-white p-4 flex justify-between items-center border-b-4 border-white">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black tracking-widest teletext-shadow">
                            İSTATİSTİK MERKEZİ
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-500 text-white p-2 border-2 border-transparent hover:border-white transition-all"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8 space-y-8 font-sans overflow-y-auto custom-scrollbar flex-1 bg-[#0a0a0a] overscroll-contain will-change-scroll">

                    {/* Top Stats Row */}
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* 1. Merged: Watched Film & Average */}
                        <div className="bg-neutral-800 p-4 border border-neutral-700 flex flex-col items-center justify-center relative group">
                            <div className="flex flex-col items-center justify-center mb-3">
                                <div className="text-4xl font-bold text-white">{stats.watchedCount}</div>
                                <div className="text-neutral-400 text-sm uppercase tracking-wider">İzlenen Film</div>
                            </div>
                            <div className="w-full border-t border-neutral-700 pt-2 flex flex-col items-center justify-center">
                                <div className="text-lg font-bold text-green-500">{stats.avgMoviesPerYear}</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">YILDA ORTALAMA</div>
                                <div className="text-xs text-neutral-600 font-medium">
                                    ({stats.minYear === 9999 ? '?' : stats.minYear} - {stats.maxYear === 0 ? '?' : stats.maxYear})
                                </div>
                            </div>
                        </div>

                        {/* 2. Total Time */}
                        <div className="bg-neutral-800 p-4 border border-neutral-700 flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold text-white">{stats.totalWatchHours}</div>
                            <div className="text-neutral-400 text-sm uppercase tracking-wider">Saat ({stats.totalWatchDays} Gün)</div>
                        </div>

                        {/* 3. Merged: Most Watched Year & Frequency */}
                        <div className="bg-neutral-800 p-4 border border-neutral-700 flex flex-col items-center justify-center relative group">
                            <div className="flex flex-col items-center justify-center mb-3">
                                <div className="text-4xl font-bold text-white">{stats.mostWatchedYear}</div>
                                <div className="text-neutral-400 text-sm uppercase tracking-wider">EN ÇOK İZLENEN YIL</div>
                            </div>
                            <div className="w-full border-t border-neutral-700 pt-2 flex flex-col items-center justify-center">
                                <div className="text-lg font-bold text-orange-500">
                                    {stats.mostWatchedYearCount} Film <span className="text-neutral-600 mx-1">|</span> {stats.mostWatchedYearFrequency} Gün
                                </div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wider">SIKLIK</div>
                            </div>
                        </div>

                        {/* 4. Watchlist */}
                        <div className="bg-neutral-800 p-4 border border-neutral-700 flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold text-white">{stats.watchlistCount}</div>
                            <div className="text-neutral-400 text-sm uppercase tracking-wider">İzlenecek Listesi</div>
                        </div>
                    </div>

                    {/* Charts Row 1: Ratings Pie & Decade Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Rating Pie Chart */}
                        <div className="bg-neutral-900 p-6 border border-neutral-800">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-700 pb-2">
                                Puan Dağılımı
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.ratingData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            label={({ name, percent }) => `${name} (%${(percent * 100).toFixed(0)})`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.ratingData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-center mt-4 pt-4 border-t border-neutral-800">
                                <p className="text-sm text-neutral-400">
                                    <span className="text-white font-bold text-lg">{stats.ratedMovieCount} Film</span>
                                    <span className="mx-2 text-neutral-600">|</span>
                                    <span className="text-yellow-500 font-bold text-lg">{stats.globalAverageRating}</span>
                                </p>
                            </div>
                        </div>

                        {/* Decade Analysis (Golden Age) */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-center relative overflow-hidden group flex-1">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                </div>

                                <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
                                    EN İYİ 10 YIL ARALIĞI
                                </h3>

                                <div className="relative z-10">
                                    <div className="text-6xl font-black text-white mb-2 font-mono">
                                        {stats.bestDecade}
                                    </div>
                                    <div className="text-lg text-yellow-500/80 mb-6 font-bold flex flex-col gap-1">
                                        <span>Ortalama Puan: {stats.bestDecadeAvg}</span>
                                        <span className="text-sm text-neutral-500">({stats.bestDecadeCount} Film)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-950/30 border border-red-900/50 p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-red-500 font-bold mb-1 uppercase tracking-wider">En Düşük Puanlı Yıl</h3>
                                    <p className="text-4xl font-black text-white">{stats.worstYear}</p>
                                    <p className="text-red-400 text-sm mt-1">Ortalama Puan: {stats.worstAvg}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2: Genres & Time Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Genre Bar Chart */}
                        <div className="bg-neutral-900 p-6 border border-neutral-800">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-700 pb-2">
                                Favori Türler
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={stats.genreData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                        <XAxis type="number" stroke="#666" />
                                        <YAxis dataKey="name" type="category" stroke="#fff" width={100} tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            cursor={{ fill: '#333', opacity: 0.5 }}
                                            contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff' }}
                                        />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                            {stats.genreData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'][index % 5]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Year Distribution Area Chart */}
                        <div className="bg-neutral-900 p-6 border border-neutral-800">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-700 pb-2">
                                Zaman Çizelgesi
                            </h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={stats.yearDistributionData}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="year" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>


                    {/* Top Years Analysis Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Top Watched Years */}
                        <div className="bg-neutral-900 p-6 border border-neutral-800">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-neutral-700 pb-2">
                                En Çok İzlenen Yıllar
                            </h3>
                            <div className="space-y-3">
                                {stats.topWatchedYears.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between bg-neutral-800 p-3 hover:bg-neutral-700 transition-colors border border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-6 h-6 text-xs font-bold ${i === 0 ? 'bg-orange-500 text-black' : 'bg-neutral-600 text-white'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="text-white font-medium">{d.year}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-400 font-bold text-sm bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">{d.avg} ★</span>
                                            <span className="text-white font-bold">{d.count} Film</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top High Rated Years */}
                        <div className="bg-neutral-900 p-6 border border-neutral-800">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-neutral-700 pb-2">
                                EN ÇOK 4+ YILDIZ ALAN YILLAR
                            </h3>
                            <div className="space-y-3">
                                {stats.topHighRatedYears.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between bg-neutral-800 p-3 hover:bg-neutral-700 transition-colors border border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-6 h-6 text-xs font-bold ${i === 0 ? 'bg-green-500 text-black' : 'bg-neutral-600 text-white'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="text-white font-medium">{d.year}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-500 font-bold text-sm bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">{d.avg} ★</span>
                                            <span className="text-white font-bold">{d.count} Film</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Other Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Top Directors List */}
                        <div className="bg-neutral-900 p-6 border border-neutral-800">
                            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2 border-b border-neutral-700 pb-2">
                                Yıldızların Yönetmenleri
                            </h3>
                            <p className="text-xs text-neutral-500 mb-4">EN ÇOK 4+ YILDIZ ALANLAR</p>
                            <div className="space-y-3">
                                {stats.topDirectors.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between bg-neutral-800 p-3 hover:bg-neutral-700 transition-colors border border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-6 h-6 text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-neutral-600 text-white'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="text-white font-medium">{d.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-400 font-bold">{d.count} Film</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fun/Worst Stats */}
                        <div className="bg-neutral-900 p-6 border border-neutral-800 h-full">
                            <h3 className="text-xl font-bold text-white mb-1 tracking-wider border-b border-neutral-700 pb-2">En Çok İzlenen Yönetmenler</h3>
                            <p className="text-xs text-neutral-500 mb-4 uppercase">EN ÇOK IZLENENLER</p>
                            <div className="space-y-3">
                                {stats.mostWatchedDirectors.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between bg-neutral-800 p-3 hover:bg-neutral-700 transition-colors border border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-6 h-6 text-xs font-bold ${i === 0 ? 'bg-cyan-500 text-black' : 'bg-neutral-600 text-white'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="text-white font-medium">{d.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-cyan-400 font-bold text-sm bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">{d.avg} ★</span>
                                            <span className="text-white font-bold">{d.count} Film</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-neutral-700 text-center">
                                <p className="text-neutral-500 text-xs uppercase tracking-wider">
                                    TOPLAM: <span className="text-white font-bold">{stats.totalDirectors}</span> YÖNETMEN
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div className="text-center pt-8 pb-4">
                        <p className="text-neutral-600 text-xs tracking-widest uppercase">
                            BolVitamin İstatistik Servisi • {new Date().getFullYear()}
                        </p>
                    </div>

                </div>
            </div>
        </div>

    );
}
