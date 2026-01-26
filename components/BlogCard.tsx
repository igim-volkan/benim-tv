import React from 'react';
import { BlogEntry } from '../types';
import { Newspaper, ChevronRight } from 'lucide-react';

interface BlogCardProps {
    post: BlogEntry;
    onClick: (post: BlogEntry) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
    return (
        <div
            onClick={() => onClick(post)}
            className="group relative bg-neutral-900 border-2 border-white hover:border-yellow-400 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
        >
            {/* Top 'Newspaper' Aesthetic Line */}
            <div className="bg-neutral-800 h-2 w-full border-b border-white group-hover:bg-yellow-400 transition-colors"></div>

            <div className="p-6 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-3">
                    <Newspaper size={14} />
                    <span>{post.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-3 leading-snug">
                    {post.title}
                </h3>

                {/* Summary */}
                <p className="text-neutral-400 text-sm line-clamp-4 leading-relaxed mb-6 flex-1 font-inter font-normal">
                    {post.summary}
                </p>

                {/* Footer Action */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800">
                    <span className="text-xs text-neutral-600 font-mono uppercase tracking-widest">{post.author}</span>
                    <button className="flex items-center gap-1 text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                        OKU <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Hover Glitch Effect Overlay (Subtle) */}
            <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
};
