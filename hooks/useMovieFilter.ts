import { useState, useMemo, useEffect } from 'react';
import { MovieEntry } from '../types';

interface FilterState {
    searchTerm: string;
    genre: string;
    year: string;
    rating: number | '';
    director: string;
}

export const useMovieFilter = (movies: MovieEntry[]) => {
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        genre: '',
        year: '',
        rating: '',
        director: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    const [sortOption, setSortOption] = useState<'year_asc' | 'year_desc' | 'title_asc' | 'title_desc' | 'date_asc' | 'date_desc'>('date_desc');

    const setFilter = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            searchTerm: '',
            genre: '',
            year: '',
            rating: '',
            director: ''
        });
        setSortOption('date_desc');
    };

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortOption]);

    // Derived Lists for Dropdowns
    const availableGenres = useMemo(() => {
        const g = new Set<string>();
        movies.forEach(m => m.genre.forEach(gen => g.add(gen)));
        return Array.from(g).sort();
    }, [movies]);

    const availableYears = useMemo(() => {
        const y = new Set<string>();
        movies.forEach(m => y.add(m.year));
        return Array.from(y).sort().reverse();
    }, [movies]);

    const availableDirectors = useMemo(() => {
        const d = new Set<string>();
        movies.forEach(m => {
            if (m.director && m.director !== 'Bilinmiyor') {
                m.director.split(',').map(s => s.trim()).forEach(dir => {
                    if (dir) d.add(dir);
                });
            }
        });
        return Array.from(d).sort();
    }, [movies]);

    // Filtering Logic
    const filteredMovies = useMemo(() => {
        const filtered = movies.filter(m => {
            const matchesSearch = m.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                m.originalTitle.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                m.director.toLowerCase().includes(filters.searchTerm.toLowerCase());

            const matchesGenre = filters.genre ? m.genre.includes(filters.genre) : true;
            const matchesYear = filters.year ? m.year === filters.year : true;
            const matchesRating = filters.rating !== '' ? m.userRating === Number(filters.rating) : true;

            // Director check: split movie directors and check if includes selected
            const movieDirectors = m.director ? m.director.split(',').map(s => s.trim()) : [];
            const matchesDirector = filters.director ? movieDirectors.includes(filters.director) : true;

            return matchesSearch && matchesGenre && matchesYear && matchesRating && matchesDirector;
        });

        // Apply Sorting
        return filtered.sort((a, b) => {
            switch (sortOption) {
                case 'year_asc':
                    return a.year.localeCompare(b.year);
                case 'year_desc':
                    return b.year.localeCompare(a.year);
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                case 'title_desc':
                    return b.title.localeCompare(a.title);
                case 'date_asc':
                    return (a.createdAt || '').localeCompare(b.createdAt || '');
                case 'date_desc':
                    return (b.createdAt || '').localeCompare(a.createdAt || '');
                default:
                    return 0;
            }
        });

    }, [movies, filters, sortOption]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMovies.slice(start, start + itemsPerPage);
    }, [filteredMovies, currentPage]);

    const goToNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const goToPrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

    return {
        filters,
        setFilter,
        resetFilters,
        sortOption,
        setSortOption,
        filteredMovies, // Keep full list for counts
        paginatedMovies, // Use this for display
        availableGenres,
        availableYears,
        availableDirectors,
        pagination: {
            currentPage,
            totalPages,
            goToNextPage,
            goToPrevPage,
            setCurrentPage
        }
    };
};
