import React, { useState, useEffect } from 'react';
import { MovieEntry, AddMovieFormData, SuggestionEntry, BlogEntry, Order } from '../types';
import { Check, Edit, Trash2, X, Eye, Plus, FileText, Search, ShoppingBag, Clock, User, Database, Upload, Download } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AddMovieModal } from './AddMovieModal';
import { AddBlogModal } from './AddBlogModal';
import { blogService } from '../services/blogService';
import { shopService } from '../services/shopService';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const ITEMS_PER_PAGE = 50;

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
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'suggestions' | 'blog' | 'orders' | 'backup'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Orders State
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (activeTab === 'orders') {
            loadOrders();
        }
    }, [activeTab]);

    const loadOrders = async () => {
        const data = await shopService.getOrders();
        setOrders(data);
    };

    const handleOrderStatus = async (id: string, status: 'completed') => {
        if (window.confirm("Siparişi tamamlandı olarak işaretlemek istediğinize emin misiniz?")) {
            await shopService.updateOrderStatus(id, status);
            loadOrders();
        }
    };


    // Local state for draggable list
    const [localBlogPosts, setLocalBlogPosts] = useState<BlogEntry[]>([]);

    useEffect(() => {
        setLocalBlogPosts(blogPosts);
    }, [blogPosts]);

    // Reset page when tab or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

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

    // --- BACKUP & RESTORE ---
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreStatus, setRestoreStatus] = useState<string>('');

    const handleBackup = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movies, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `bolvitamin_yedek_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (!event.target.files?.[0]) return;

        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const parsedMovies = JSON.parse(content) as MovieEntry[];

                if (!Array.isArray(parsedMovies)) {
                    alert("Geçersiz dosya formatı. JSON dizisi bekleniyor.");
                    return;
                }

                if (!window.confirm(`${parsedMovies.length} adet film bulundu. Geri yükleme işlemini başlatmak istiyor musunuz? (Mevcut kayıtlar kontrol edilecek)`)) {
                    return;
                }

                setIsRestoring(true);
                setRestoreStatus('Geri yükleme başlıyor...');

                let addedCount = 0;
                let skippedCount = 0;

                for (const movie of parsedMovies) {
                    // Check if exists by title (simple check) to avoid duplicates
                    // Ideally check by ID if preserving IDs, but Firestore IDs are auto-generated usually on add.
                    // If we restore with IDs, we might overwrite?
                    // Let's assume we want to restore MISSING movies.

                    // Sanitize data
                    const { id, ...movieData } = movie; // Exclude ID to let Firestore generate new one or we can use setDoc if we want to preserve ID.
                    // Let's check duplicate by Title

                    const q = query(collection(db, "movies"), where("title", "==", movie.title));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        skippedCount++;
                        setRestoreStatus(`Atlandı (Mevcut): ${movie.title} (${addedCount} eklendi, ${skippedCount} atlandı)`);
                    } else {
                        // Add new
                        await addDoc(collection(db, "movies"), {
                            ...movieData,
                            createdAt: movieData.createdAt || new Date().toISOString(),
                            isApproved: movieData.isApproved !== undefined ? movieData.isApproved : true // Default to approved if restoring? Or keep original state.
                        });
                        addedCount++;
                        setRestoreStatus(`Eklendi: ${movie.title} (${addedCount} eklendi, ${skippedCount} atlandı)`);
                    }
                }

                setRestoreStatus(`İşlem tamamlandı! Toplam ${addedCount} film eklendi ve ${skippedCount} film (zaten var olduğu için) atlandı.`);
                alert(`Geri yükleme tamamlandı.\nEklenen: ${addedCount}\nAtlanan: ${skippedCount}`);

            } catch (error) {
                console.error("Restore error:", error);
                alert("Geri yükleme sırasında hata oluştu. Dosyayı kontrol edin.");
            } finally {
                setIsRestoring(false);
            }
        };
    };

    // Helper to render movie actions based on tab

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

    const moviesDisplay = (activeTab === 'pending' ? pendingMovies : approvedMovies).filter(m => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            m.title.toLowerCase().includes(term) ||
            m.director.toLowerCase().includes(term) ||
            m.genre.some(g => g.toLowerCase().includes(term))
        );
    });

    const totalPages = Math.ceil(moviesDisplay.length / ITEMS_PER_PAGE);
    const paginatedMovies = moviesDisplay.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            {(activeTab === 'pending' || activeTab === 'approved') && (
                <div className="flex items-center bg-neutral-900 border-2 border-white p-2 mb-4">
                    <Search className="text-neutral-500 mr-2" />
                    <input
                        type="text"
                        placeholder="FİLM, YÖNETMEN VEYA TÜR ARA..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-white w-full outline-none font-bold placeholder-neutral-600 uppercase"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="text-red-500 font-bold hover:text-red-400">
                            TEMİZLE
                        </button>
                    )}
                </div>
            )}

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
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`text-xl font-bold px-4 py-2 whitespace-nowrap ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                    SİPARİŞLER ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                    onClick={() => setActiveTab('backup')}
                    className={`text-xl font-bold px-4 py-2 whitespace-nowrap ${activeTab === 'backup' ? 'bg-blue-500 text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                    VERİ YÖNETİMİ
                </button>
            </div>

            {/* CONTENT AREA */}

            {/* 0. ORDERS TAB */}
            {activeTab === 'orders' && (
                orders.length === 0 ? (
                    <div className="border-4 border-white border-dashed p-12 text-center bg-neutral-900">
                        <h2 className="text-3xl text-neutral-500">BEKLEYEN SİPARİŞ YOK</h2>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map(order => (
                            <div key={order.id} className={`border-2 p-6 relative ${order.status === 'completed' ? 'bg-neutral-900 border-neutral-700 opacity-70' : 'bg-black border-white'}`}>
                                <div className="flex justify-between items-start mb-4 border-b border-neutral-700 pb-2">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="text-orange-500" />
                                        <h3 className="text-white font-bold text-xl uppercase">SİPARİŞ #{order.id.slice(0, 8)}</h3>
                                        <span className={`px-2 py-0.5 text-xs font-bold ${order.status === 'completed' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                                            {order.status === 'completed' ? 'TAMAMLANDI' : 'BEKLIYOR'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-neutral-400 text-sm font-mono flex items-center justify-end gap-1">
                                            <Clock size={14} />
                                            {new Date(order.createdAt).toLocaleString("tr-TR")}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-neutral-500 text-xs font-bold block mb-1">ÜRÜN</label>
                                        <div className="text-xl text-yellow-400 font-bold">{order.productName}</div>
                                        <div className="text-sm">
                                            <p><span className="text-neutral-500">Adet:</span> {order.quantity}</p>
                                            <p><span className="text-neutral-500">E-posta:</span> {order.customerEmail}</p>
                                            {order.customerNote && (
                                                <p className="mt-2 text-yellow-400 border-l-2 border-yellow-400 pl-2">
                                                    <span className="text-neutral-500 block text-xs">Açıklama:</span>
                                                    {order.customerNote}
                                                </p>
                                            )}
                                            <p><span className="text-neutral-500">Tarih:</span> {new Date(order.createdAt).toLocaleString('tr-TR')}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-neutral-500 text-xs font-bold block mb-1">MÜŞTERİ</label>
                                        <div className="flex items-center gap-2 text-white">
                                            <User size={16} />
                                            {order.customerEmail}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleOrderStatus(order.id, 'completed')}
                                                className="bg-green-600 text-white px-4 py-2 font-bold hover:bg-green-500 flex items-center gap-2"
                                            >
                                                <Check size={20} />
                                                TAMAMLANDI
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* BACKUP TAB */}
            {activeTab === 'backup' && (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* BACKUP */}
                    <div className="bg-neutral-900 border-2 border-white p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <Database size={64} className="text-blue-500 mb-4" />
                        <h2 className="text-3xl font-bold text-white uppercase">SİSTEM YEDEĞİ AL</h2>
                        <p className="text-neutral-400">
                            Tüm film veritabanını ({movies.length} film) JSON formatında bilgisayarınıza indirin.
                            Bu dosya daha sonra geri yükleme için kullanılabilir.
                        </p>
                        <button
                            onClick={handleBackup}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 font-bold text-xl flex items-center gap-3 mt-4"
                        >
                            <Download size={24} />
                            YEDEĞİ İNDİR
                        </button>
                    </div>

                    {/* RESTORE */}
                    <div className="bg-neutral-900 border-2 border-white p-8 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                        <Upload size={64} className="text-green-500 mb-4" />
                        <h2 className="text-3xl font-bold text-white uppercase">YEDEKTEN GERİ YÜKLE</h2>
                        <p className="text-neutral-400">
                            Daha önce aldığınız bir yedek dosyasını (.json) yükleyerek silinen verileri geri getirin.
                            (Mevcut filmler tekrar eklenmez)
                        </p>

                        {isRestoring ? (
                            <div className="w-full bg-neutral-800 p-4 rounded border border-neutral-700 mt-4">
                                <div className="text-yellow-400 animate-pulse font-mono mb-2">İŞLEM YAPILIYOR...</div>
                                <div className="text-xs text-neutral-500 font-mono text-left max-h-20 overflow-y-auto">
                                    {restoreStatus}
                                </div>
                            </div>
                        ) : (
                            <div className="relative mt-4">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleRestore}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 font-bold text-xl flex items-center gap-3 pointer-events-none">
                                    <FileText size={24} />
                                    DOSYA SEÇ VE YÜKLE
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 bg-red-900/20 border border-red-500/30 p-4 text-center">
                        <p className="text-red-400 text-sm">
                            * UYARI: Geri yükleme işlemi veritabanına doğrudan yazma yapar.
                            Büyük dosyalar için işlem biraz zaman alabilir. Lütfen sayfa yenilemeyin.
                        </p>
                    </div>
                </div>
            )}

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
                        {searchTerm ? 'ARAMA SONUCU BULUNAMADI.' : (activeTab === 'pending' ? 'ONAY BEKLEYEN KAYIT YOK.' : 'HENÜZ ONAYLANMIŞ KAYIT YOK.')}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedMovies.map(movie => (
                            <div key={movie.id} className="border-2 border-white bg-neutral-900 p-4 flex gap-4 items-start">
                                {/* Poster Thumb */}
                                <div className="w-24 aspect-[2/3] bg-black flex-shrink-0 border border-neutral-700">
                                    {(movie.posterUrl || movie.posterBase64) ? (
                                        <img src={movie.posterUrl || movie.posterBase64} alt={movie.title} className="w-full h-full object-cover" />
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 font-bold">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 border-2 border-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
                            >
                                &lt; ÖNCEKİ
                            </button>
                            <span className="text-yellow-400 text-xl">
                                SAYFA {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 border-2 border-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
                            >
                                SONRAKİ &gt;
                            </button>
                        </div>
                    )}
                </>
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

