import { useState, useEffect } from 'react';
import { MovieEntry, AddMovieFormData, MovieStatus, SuggestionEntry } from '../types';
import { fetchMovieMetadata } from '../services/geminiService';
import { db, auth } from '../services/firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useMovieData = () => {
    const [movies, setMovies] = useState<MovieEntry[]>([]);
    const [activeTab, setActiveTab] = useState<MovieStatus>('watched');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load from Firestore (Real-time)
    useEffect(() => {
        console.log("Firestore: Başlatılıyor...");
        const q = query(collection(db, "movies"), orderBy("watchedDate", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Firestore: Veri geldi, doküman sayısı:", snapshot.docs.length);
            const fetchedMovies: MovieEntry[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as MovieEntry));
            setMovies(fetchedMovies);
            setIsLoading(false);
        }, (error) => {
            console.error("Firestore Error (movies):", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Suggestions Sync (Only if Admin)
    const [suggestions, setSuggestions] = useState<SuggestionEntry[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            console.log("Hooks Auth Check:", user?.email);
            // Restrict admin access to a specific email
            setIsAdmin(!!user && user.email === 'voleksi@gmail.com');
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            setSuggestions([]);
            return;
        }

        const q = query(collection(db, "suggestions"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched: SuggestionEntry[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as SuggestionEntry));
            setSuggestions(fetched);
        }, (error) => {
            console.error("Suggestion fetch error (likely permission):", error);
        });
        return () => unsubscribe();
    }, [isAdmin]);

    const addMovie = async (data: AddMovieFormData): Promise<void> => {
        setIsSubmitting(true);
        try {
            const hasManualPoster = !!data.manualPosterBase64;
            const hasManualData = !!(data.manualYear && data.manualSummary);

            let metadata;

            // If user provides BOTH Year and Summary, we can skip text AI generation if we want, 
            // OR we can still call it for other fields (Director, Genre, Emoji, Color).
            // The prompt says "onu yapay zekadan istememiş olalım" (let's not ask AI for it).
            // But we still need Director, Genre, Emoji, ThemeColor.
            // So we should still call AI but maybe use the manual values to override?
            // Actually, if we want to "not ask AI", we could modify the prompt?
            // For simplicity and robustness (to get Director/Genre etc), let's call AI 
            // BUT override with manual values. 
            // Optimization: If ALL fields were manual, we could skip AI. But we only have Year/Summary.

            metadata = await fetchMovieMetadata(data.rawTitle, hasManualPoster);

            const entryToSave = {
                title: data.rawTitle,
                originalTitle: metadata.originalTitle || data.rawTitle,
                year: data.manualYear || metadata.year || '???',
                genre: data.manualGenres || metadata.genre || ['Bilinmiyor'],
                director: data.manualDirector || metadata.director || 'Bilinmiyor',
                summary: data.manualSummary || metadata.summary || 'Özet bulunamadı.',
                emoji: metadata.emoji || '🎬',
                themeColor: metadata.themeColor || '#64748b',
                imdbUrl: data.imdbUrl ? data.imdbUrl : (metadata.imdbUrl || ''),
                posterBase64: data.manualPosterBase64 || metadata.posterBase64 || null,
                status: data.status,
                userRating: data.userRating || null,
                userReview: data.userReview || null,
                watchedDate: data.status === 'watched' ? new Date().toISOString() : null,
                createdAt: new Date().toISOString(),
                isApproved: false // Explicitly set as pending
            };

            // Remove any remaining undefined keys just in case
            const sanitizedEntry = JSON.parse(JSON.stringify(entryToSave));

            await addDoc(collection(db, "movies"), sanitizedEntry);
            // Don't switch active tab immediately if it's pending approval?
            // setActiveTab(data.status); 
            // Maybe alert user? For now just add it.
        } catch (error) {
            console.error("Error adding movie:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateMovieStatus = async (id: string, newStatus: MovieStatus, updates: Partial<MovieEntry> = {}) => {
        try {
            const movieRef = doc(db, "movies", id);

            // Sanitize updates to remove undefined values
            const sanitizedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as any);

            await updateDoc(movieRef, {
                status: newStatus,
                ...sanitizedUpdates
            });
        } catch (error) {
            console.error("Error updating movie:", error);
        }
    };

    const approveMovie = async (id: string) => {
        try {
            const movieRef = doc(db, "movies", id);
            await updateDoc(movieRef, {
                isApproved: true
            });
        } catch (error) {
            console.error("Error approving movie:", error);
        }
    };

    const deleteMovie = async (id: string) => {
        try {
            await deleteDoc(doc(db, "movies", id));
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    const addSuggestion = async (data: Omit<SuggestionEntry, 'id' | 'createdAt'>) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "suggestions"), {
                ...data,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding suggestion:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteSuggestion = async (id: string) => {
        try {
            await deleteDoc(doc(db, "suggestions", id));
        } catch (error) {
            console.error("Error deleting suggestion:", error);
        }
    };

    return {
        movies,
        activeTab,
        setActiveTab,
        addMovie,
        updateMovieStatus,
        approveMovie,
        deleteMovie,
        isSubmitting,
        suggestions,
        addSuggestion,
        deleteSuggestion,
        isLoading
    };
};
