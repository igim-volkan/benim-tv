import React from 'react';
import { Star } from 'lucide-react';
import { MovieEntry } from '../types';
import { StarRating } from './StarRating';

interface MovieCardProps {
  movie: MovieEntry;
  onDelete?: (id: string) => void;
  onMoveToWatched?: (movie: MovieEntry) => void;
  onDirectorClick?: (director: string) => void;
  onClick?: (movie: MovieEntry) => void;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onDelete, onDirectorClick, onClick, className = '' }) => {
  const isWatched = movie.status === 'watched';

  return (
    <div
      onClick={() => onClick && onClick(movie)}
      className={`group relative bg-black border-4 ${isWatched ? 'border-neutral-700 hover:border-yellow-400' : 'border-neutral-600'} flex flex-col shadow-[8px_8px_0px_#333] transition-all cursor-pointer h-full ${className}`}
    >

      {/* Poster Section */}
      <div className="w-full aspect-[2/3] relative bg-neutral-900 border-b-4 border-neutral-700 overflow-hidden">
        {movie.posterBase64 ? (
          <img
            src={movie.posterBase64}
            alt={movie.title}
            className="w-full h-full object-cover contrast-125 saturate-150 pixelated group-hover:scale-105 transition-transform duration-500"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-blue-800 text-white">
            <span className="text-4xl">{movie.emoji}</span>
            <span className="text-sm mt-2 text-yellow-400 font-bold">NO IMAGE</span>
          </div>
        )}

        {/* Genre Badge */}
        {isWatched && movie.genre?.[0] && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 shadow-sm border border-black uppercase">
            {movie.genre[0]}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2 bg-black flex-1">

        {/* Title */}
        <div>
          <h3 className="text-2xl text-yellow-400 leading-none font-bold uppercase tracking-wide line-clamp-2 mb-1">
            {movie.title.toLocaleUpperCase('tr-TR')}
          </h3>
          <div className="text-neutral-500 font-bold text-sm uppercase truncate">
            {movie.director}
          </div>
        </div>

        {/* Year & Rating */}
        <div className="mt-auto pt-3 border-t-2 border-neutral-800 flex items-center justify-between">
          <div className="bg-neutral-800 text-white px-2 py-0.5 text-sm font-bold border border-neutral-600">
            {movie.year}
          </div>

          {isWatched && movie.userRating && (
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold text-lg">{movie.userRating}</span>
            </div>
          )}
        </div>

        {/* IMDb Icon (Small) */}
        {movie.imdbUrl && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black text-yellow-500 text-xs font-bold px-1.5 py-0.5 border border-yellow-500">IMDb</span>
          </div>
        )}

      </div>
    </div>
  );
};