import React from 'react';
import { BlogEntry } from '../types';
import { X, Calendar, Clock, User, ExternalLink } from 'lucide-react';

interface BlogDetailModalProps {
    post: BlogEntry | null;
    onClose: () => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ post, onClose }) => {
    React.useEffect(() => {
        if (post) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [post]);

    if (!post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/95 p-4 overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-neutral-900 border-x-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] my-8">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black text-white p-2 border border-white hover:bg-white hover:text-black transition-colors rounded-full"
                >
                    <X size={24} />
                </button>

                {/* Article Header */}
                <div className="bg-neutral-100 text-black border-b-4 border-black">
                    {post.coverImage && (
                        <div className="w-full h-64 md:h-96 overflow-hidden border-b-4 border-black relative">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10 scanlines pointer-events-none"></div>
                        </div>
                    )}
                    <div className="p-8 md:p-12 pb-8">
                        <div className="flex flex-wrap gap-4 text-sm font-bold opacity-60 mb-4 font-mono uppercase">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 tracking-normal">
                            {post.title}
                        </h1>
                    </div>
                </div>

                {/* Article Content */}
                <div className="p-8 md:p-12 bg-neutral-900 text-neutral-300 text-lg md:text-xl leading-relaxed font-inter font-normal">
                    <div
                        className="prose prose-invert prose-lg md:prose-xl max-w-none 
                        prose-headings:font-sans prose-headings:font-bold prose-headings:text-yellow-400
                        prose-p:mb-8 prose-p:leading-loose
                        prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-12 pt-8 border-t border-neutral-700 text-center">
                        <span className="text-4xl text-neutral-600">***</span>

                        <div className="mt-8">
                            <p className="text-neutral-400 mb-4 text-base">Bu içeriği beğendiyseniz, sıradaki filmimi seçmek için Patreon'a göz atabilirsiniz:</p>
                            <a
                                href="https://www.patreon.com/bolvitamin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-cyan-400 text-black px-8 py-4 text-xl font-bold hover:bg-white hover:text-cyan-500 transition-colors flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
                            >
                                <span>BİR FİLM ISMARLA (PATREON)</span>
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
