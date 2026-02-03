import React, { useState, useEffect } from 'react';
import { MovieEntry, AddMovieFormData, SuggestionEntry, BlogEntry } from '../types';
import { Check, Edit, Trash2, X, Eye, Plus, FileText } from 'lucide-react';
import { AddMovieModal } from './AddMovieModal';
import { AddBlogModal } from './AddBlogModal';
import { blogService } from '../services/blogService';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface AdminPanelProps {
    movies: MovieEntry[];
    onApprove: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onUpdate: (id: string, data: Partial<MovieEntry>) => Promise<void>;
    suggestions: SuggestionEntry[];
    onDeleteSuggestion: (id: string) => Promise<void>;
    blogPosts: BlogEntry[];
    onBlogUpdate: () => Promise<void>; // To trigger a refresh in App.tsx
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ movies, onApprove, onDelete, onUpdate, suggestions, onDeleteSuggestion, blogPosts, onBlogUpdate }) => {
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'suggestions' | 'blog'>('pending');

    // Local state for draggable list
    const [localBlogPosts, setLocalBlogPosts] = useState<BlogEntry[]>([]);

    useEffect(() => {
        setLocalBlogPosts(blogPosts);
    }, [blogPosts]);

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from<BlogEntry>(localBlogPosts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Optimistic update
        setLocalBlogPosts(items);

        // Persist to DB
        try {
            await blogService.reorderBlogPosts(items);
            // We can call onBlogUpdate if we want to re-sync with server, 
            // but for DnD specifically we might want to avoid full refresh flicker.
            // However, App.tsx needs to know the new order for the main frontend view.
            onBlogUpdate();
        } catch (error) {
            console.error("Failed to reorder blog posts", error);
            // Revert on error?
            setLocalBlogPosts(blogPosts);
        }
    };

    // Derived lists
    const pendingMovies = movies.filter(m => m.isApproved === false);
    const approvedMovies = movies.filter(m => m.isApproved !== false);

    // Movie Edit State
    const [editingMovie, setEditingMovie] = useState<MovieEntry | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Blog Edit State
    const [editingBlogPost, setEditingBlogPost] = useState<BlogEntry | undefined>(undefined);
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [isBlogSubmitting, setIsBlogSubmitting] = useState(false);

    // --- MOVIE HANDLERS ---
    const handleEditClick = (movie: MovieEntry) => {
        setEditingMovie(movie);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (data: AddMovieFormData) => {
        if (!editingMovie) return;
        setIsSubmitting(true);
        try {
            await onUpdate(editingMovie.id, {
                title: data.rawTitle,
                status: data.status,
                userRating: data.userRating,
                userReview: data.userReview,
                imdbUrl: data.imdbUrl,
                posterBase64: data.manualPosterBase64,
                year: data.manualYear || editingMovie.year,
                director: data.manualDirector || editingMovie.director,
                genre: data.manualGenres || editingMovie.genre,
                summary: data.manualSummary || editingMovie.summary
            });
            setIsEditModalOpen(false);
            setEditingMovie(null);
        } catch (error) {
            console.error("Update failed", error);
            alert("Guncelleme basarisiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = async (id: string) => {
        if (window.confirm("BU KAYDI REDDETMEK VE SILMEK ISTEDIGINIZE EMIN MISINIZ?")) {
            await onDelete(id);
        }
    };

    // --- BLOG HANDLERS ---
    const handleAddBlogClick = () => {
        setEditingBlogPost(undefined);
        setIsBlogModalOpen(true);
    };

    const handleEditBlogClick = (post: BlogEntry) => {
        setEditingBlogPost(post);
        setIsBlogModalOpen(true);
    };

    const handleBlogSubmit = async (data: Omit<BlogEntry, 'id'>) => {
        setIsBlogSubmitting(true);
        try {
            if (editingBlogPost) {
                await blogService.updateBlogPost(editingBlogPost.id, data);
            } else {
                await blogService.addBlogPost(data);
            }
            await onBlogUpdate(); // Refresh the list
            setIsBlogModalOpen(false);
            setEditingBlogPost(undefined);
        } catch (error) {
            console.error("Blog update failed", error);
            alert("Blog işlemi başarısız oldu.");
        } finally {
            setIsBlogSubmitting(false);
        }
    };

    const handleDeleteBlogClick = async (id: string) => {
        if (window.confirm("BU BLOG YAZISINI SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?")) {
            try {
                await blogService.deleteBlogPost(id);
                await onBlogUpdate();
            } catch (error) {
                console.error("Blog delete failed", error);
                alert("Silme işlemi başarısız.");
            }
        }
    };


    // Helper to render movie actions based on tab
    const renderActions = (movie: MovieEntry) => (
        <div className="flex flex-col gap-2">
            {activeTab === 'pending' && (
                <button
                    onClick={() => onApprove(movie.id)}
                    className="bg-green-600 hover:bg-green-500 text-white p-2"
                    title="ONAYLA"
                >
                    <Check size={24} />
                </button>
            )}
            {movie.status !== 'watched' && (
                <button
                    onClick={() => onUpdate(movie.id, { status: 'watched', watchedDate: new Date().toISOString() })}
                    className="bg-purple-600 hover:bg-purple-500 text-white p-2"
                    title="IZLENDI OLARAK ISARETLE"
                >
                    <Eye size={24} />
                </button>
            )}
            <button
                onClick={() => handleEditClick(movie)}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2"
                title="DUZENLE"
            >
                <Edit size={24} />
            </button>
            <button
                onClick={() => handleDeleteClick(movie.id)}
                className="bg-red-600 hover:bg-red-500 text-white p-2"
                title="SIL / REDDET"
            >
                <Trash2 size={24} />
            </button>
        </div>
    );

    const moviesDisplay = activeTab === 'pending' ? pendingMovies : approvedMovies;

    return (
        <div className="space-y-6">
            {/* Top Tabs */}
            <div className="flex gap-4 border-b-2 border-white pb-2 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`text-xl font-bold px-4 py-2 whitespace-nowrap ${activeTab === 'pending' ? 'bg-yellow-400 text-black' : 'text-neutral-500 hover:text-white'}`}
                >
                    ONAY BEKLEYENLER ({pendingMovies.length})
                </button>
                <button
                    onClick={() => setActiveTab('approved')}
                    className={`text-xl font-bold px-4 py-2 whitespace-nowrap ${activeTab === 'approved' ? 'bg-green-600 text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                    KAYITLI ARŞİV ({approvedMovies.length})
                </button>
                <button
                    onClick={() => setActiveTab('suggestions')}
                    className={`text-xl font-bold px-4 py-2 whitespace-nowrap ${activeTab === 'suggestions' ? 'bg-purple-600 text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                    ÖNERİLER ({suggestions.length})
                </button>
                <button
                    onClick={() => setActiveTab('blog')}
                    className={`text-xl font-bold px-4 py-2 whitespace-nowrap ${activeTab === 'blog' ? 'bg-cyan-600 text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                    BLOG YAZILARI ({blogPosts.length})
                </button>
            </div>

            {/* CONTENT AREA */}

            {/* 1. SUGGESTIONS TAB */}
            {activeTab === 'suggestions' && (
                suggestions.length === 0 ? (
                    <div className="border-4 border-white border-dashed p-12 text-center bg-neutral-900">
                        <h2 className="text-3xl text-neutral-500">MESAJ KUTUSU BOŞ</h2>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {suggestions.map(s => (
                            <div key={s.id} className="border-2 border-white bg-neutral-900 p-6 relative">
                                <div className="flex justify-between items-start mb-4 border-b border-neutral-700 pb-2">
                                    <div>
                                        <h3 className="text-yellow-400 font-bold text-xl uppercase">{s.name} {s.surname}</h3>
                                        <span className="text-neutral-500 text-sm font-mono">{new Date(s.createdAt).toLocaleString("tr-TR")}</span>
                                    </div>
                                    <button onClick={() => onDeleteSuggestion(s.id)} className="bg-red-900 text-red-200 p-2 hover:bg-red-800" title="SİL">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <p className="text-white text-lg font-mono leading-relaxed whitespace-pre-wrap">{s.message}</p>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* 2. BLOG TAB */}
            {activeTab === 'blog' && (
                <div className="space-y-6">
                    <button
                        onClick={handleAddBlogClick}
                        className="bg-yellow-400 text-black px-6 py-3 font-bold text-xl flex items-center gap-2 hover:bg-white transition-colors"
                    >
                        <Plus size={24} />
                        YENİ YAZI EKLE
                    </button>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="blog-list">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {localBlogPosts.map((post, index) => (
                                        <Draggable key={post.id} draggableId={post.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="border-2 border-white bg-neutral-900 p-4 flex gap-4 group hover:border-yellow-400 transition-colors"
                                                >
                                                    <div className="w-32 aspect-video bg-black flex-shrink-0 border border-neutral-700 overflow-hidden relative">
                                                        {post.coverImage ? (
                                                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-neutral-700"><FileText size={32} /></div>
                                                        )}
                                                        <div className="absolute top-0 right-0 bg-yellow-400 text-black px-1 font-bold text-xs opacity-0 group-hover:opacity-100 cursor-grab">
                                                            SIRA: {index + 1}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-xl font-bold text-cyan-400 truncate">{post.title}</h3>
                                                        <div className="text-sm text-neutral-400 font-mono mb-2">
                                                            {post.date} • {post.author}
                                                        </div>
                                                        <div className="text-neutral-300 line-clamp-2 text-sm font-inter">
                                                            {post.summary}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => handleEditBlogClick(post)}
                                                            className="bg-blue-600 hover:bg-blue-500 text-white p-2"
                                                            title="DÜZENLE"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBlogClick(post.id)}
                                                            className="bg-red-600 hover:bg-red-500 text-white p-2"
                                                            title="SİL"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}

            {/* 3. MOVIES TABS (Pending & Approved) */}
            {(activeTab === 'pending' || activeTab === 'approved') && (moviesDisplay.length === 0 ? (
                <div className="border-4 border-white border-dashed p-12 text-center bg-neutral-900">
                    <h2 className="text-3xl text-neutral-500 mb-2">
                        {activeTab === 'pending' ? 'HER SEY YOLUNDA' : 'ARŞİV BOŞ'}
                    </h2>
                    <p className="text-xl text-white">
                        {activeTab === 'pending' ? 'ONAY BEKLEYEN KAYIT YOK.' : 'HENÜZ ONAYLANMIŞ KAYIT YOK.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moviesDisplay.map(movie => (
                        <div key={movie.id} className="border-2 border-white bg-neutral-900 p-4 flex gap-4 items-start">
                            {/* Poster Thumb */}
                            <div className="w-24 aspect-[2/3] bg-black flex-shrink-0 border border-neutral-700">
                                {movie.posterBase64 ? (
                                    <img src={movie.posterBase64} alt={movie.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-2xl">🎬</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-yellow-400 truncate">{movie.title}</h3>
                                <div className="text-sm text-neutral-400 font-bold mb-2">
                                    {movie.year} • {movie.director}
                                </div>
                                <div className="text-xs text-neutral-500 mb-2 line-clamp-2">
                                    {movie.summary}
                                </div>
                                <div className="flex gap-2 text-xs font-bold">
                                    <span className={`px-2 py-1 ${movie.status === 'watched' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                                        {movie.status === 'watched' ? 'İZLENDİ' : 'İZLENECEK'}
                                    </span>
                                    {movie.userRating && (
                                        <span className="bg-yellow-900 text-yellow-200 px-2 py-1">
                                            ★ {movie.userRating}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {renderActions(movie)}
                        </div>
                    ))}
                </div>
            ))}

            {/* MODALS */}
            <AddMovieModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditingMovie(null); }}
                onSubmit={handleEditSubmit}
                isSubmitting={isSubmitting}
                editMovie={editingMovie || undefined}
            />

            <AddBlogModal
                isOpen={isBlogModalOpen}
                onClose={() => { setIsBlogModalOpen(false); setEditingBlogPost(undefined); }}
                onSubmit={handleBlogSubmit}
                isSubmitting={isBlogSubmitting}
                editPost={editingBlogPost}
            />
        </div>
    );
};

