import React, { useState } from 'react';
import { BlogEntry } from '../types';
import { X, Save, Image as ImageIcon } from 'lucide-react';

interface AddBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<BlogEntry, 'id'>) => Promise<void>;
    isSubmitting: boolean;
    editPost?: BlogEntry;
}

export const AddBlogModal: React.FC<AddBlogModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, editPost }) => {
    if (!isOpen) return null;

    const [title, setTitle] = useState(editPost?.title || '');
    const [summary, setSummary] = useState(editPost?.summary || '');
    const [content, setContent] = useState(editPost?.content || '');
    const [author, setAuthor] = useState(editPost?.author || 'BOLVITAMIN');
    const [date, setDate] = useState(editPost?.date || new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }).toUpperCase());
    const [readTime, setReadTime] = useState(editPost?.readTime || '3 dk');
    const [coverImage, setCoverImage] = useState(editPost?.coverImage || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            title,
            summary,
            content,
            author,
            date,
            readTime,
            coverImage
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-neutral-900 border-4 border-white p-6 shadow-[0_0_50px_rgba(255,255,255,0.1)]">

                <div className="flex justify-between items-center mb-6 border-b-2 border-neutral-700 pb-4">
                    <h2 className="text-3xl font-black text-yellow-400 uppercase">
                        {editPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white"
                    >
                        <X size={32} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-400 mb-1">BAŞLIK</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black border-2 border-neutral-700 p-3 text-white font-bold focus:border-yellow-400 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-400 mb-1">ÖZET (Kartta görünecek)</label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    className="w-full bg-black border-2 border-neutral-700 p-3 text-white h-24 focus:border-yellow-400 outline-none transition-colors resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-400 mb-1">YAZAR</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full bg-black border-2 border-neutral-700 p-3 text-white font-mono focus:border-yellow-400 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-400 mb-1">TARİH</label>
                                    <input
                                        type="text"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-black border-2 border-neutral-700 p-3 text-white font-mono focus:border-yellow-400 outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-400 mb-1">OKUMA SÜRESİ</label>
                                    <input
                                        type="text"
                                        value={readTime}
                                        onChange={(e) => setReadTime(e.target.value)}
                                        className="w-full bg-black border-2 border-neutral-700 p-3 text-white font-mono focus:border-yellow-400 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-400 mb-1">KAPAK GÖRSELİ (URL)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={coverImage}
                                            onChange={(e) => setCoverImage(e.target.value)}
                                            className="w-full bg-black border-2 border-neutral-700 p-3 pl-10 text-white font-mono focus:border-yellow-400 outline-none transition-colors"
                                        />
                                        <ImageIcon size={18} className="absolute left-3 top-3.5 text-neutral-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 h-full flex flex-col">
                            <label className="block text-sm font-bold text-neutral-400 mb-1">İÇERİK (HTML)</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full flex-1 bg-black border-2 border-neutral-700 p-3 text-white font-mono text-sm focus:border-yellow-400 outline-none transition-colors resize-none leading-relaxed"
                                placeholder="<p>Paragraf...</p>"
                                required
                            />
                            <p className="text-xs text-neutral-500">
                                İpucu: Paragrafları &lt;p class="mb-4"&gt; içine alın. Başlıklar için &lt;h3 class="text-xl font-bold text-yellow-400"&gt; kullanın.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-neutral-800">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                flex items-center gap-2 px-8 py-4 text-xl font-bold uppercase tracking-wider
                                transition-all transform active:scale-95
                                ${isSubmitting
                                    ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                    : 'bg-yellow-400 text-black hover:bg-white'
                                }
                            `}
                        >
                            <Save size={24} />
                            {isSubmitting ? 'KAYDEDİLİYOR...' : 'KAYDET VE YAYINLA'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
