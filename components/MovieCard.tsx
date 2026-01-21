import React, { useState } from 'react';
import { Trash2, Quote, Clapperboard, ExternalLink, Share2, CheckCircle2, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { MovieEntry } from '../types';
import { StarRating } from './StarRating';

interface MovieCardProps {
  movie: MovieEntry;
  onDelete: (id: string) => void;
  onMoveToWatched?: (movie: MovieEntry) => void;
  onDirectorClick?: (director: string) => void;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onDelete, onMoveToWatched, onDirectorClick, className = '' }) => {
  const isWatched = movie.status === 'watched';

  return (
    <div className={`relative bg-black border-4 ${isWatched ? 'border-white' : 'border-neutral-600'} flex flex-col sm:flex-row shadow-[8px_8px_0px_#333] ${className}`}>

      {/* Poster Section */}
      <div className="w-full sm:w-[180px] aspect-[2/3] relative bg-neutral-900 border-b-4 sm:border-b-0 sm:border-r-4 border-white shrink-0 overflow-hidden group">
        {movie.posterBase64 ? (
          <img
            src={movie.posterBase64}
            alt={movie.title}
            className="w-full h-full object-cover contrast-125 saturate-150 pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-blue-800 text-white">
            <span className="text-4xl">{movie.emoji}</span>
            <span className="text-sm mt-2 text-yellow-400">NO IMAGE</span>
          </div>
        )}

        {/* Genre Badge - Only for Watched */}
        {isWatched && (
          <div className={`absolute top-0 left-0 text-black text-lg font-bold px-2 py-0.5 border-b-2 border-r-2 border-black ${isWatched ? 'bg-yellow-400' : 'bg-cyan-400'}`}>
            {movie.genre[0]}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col relative bg-black gap-4 min-w-0">

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Title - Turkish Uppercase Fix */}
            <h3 className="text-3xl text-yellow-400 leading-none mb-2 font-bold uppercase tracking-wide break-words">
              {movie.title.toLocaleUpperCase('tr-TR')}
            </h3>

            {isWatched && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-lg text-green-400 font-bold uppercase">{'>'}</span>
                {movie.director.split(',').map((d, i, arr) => (
                  <React.Fragment key={i}>
                    <button
                      onClick={() => onDirectorClick && onDirectorClick(d.trim())}
                      className="text-lg text-green-400 hover:bg-green-400 hover:text-black transition-colors uppercase inline-block font-bold border-b border-transparent hover:border-black"
                      disabled={!onDirectorClick}
                    >
                      {d.trim().toLocaleUpperCase('tr-TR')}
                    </button>
                    {i < arr.length - 1 && <span className="text-green-400 font-bold">,</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Year Badge - Only for Watched */}
          {isWatched && (
            <div className="bg-white text-black px-3 py-1 text-2xl font-bold shrink-0 shadow-[4px_4px_0px_rgba(50,50,50,1)] h-fit">
              {movie.year}
            </div>
          )}
        </div>

        {/* Summary Block - Only for Watched */}
        {isWatched && (
          <div className="flex-1 text-white text-lg leading-tight py-1">
            {movie.summary}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto border-t-2 border-neutral-800 pt-4 flex flex-col gap-3">

          {isWatched ? (
            <>
              {movie.userReview && (
                <div className="text-magenta-500 text-xl italic bg-neutral-900 p-3 border border-neutral-700">
                  "{movie.userReview.toLocaleUpperCase('tr-TR')}"
                </div>
              )}

              <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
                <div className="bg-black border-2 border-yellow-400 px-3 py-1 flex justify-center">
                  <StarRating rating={movie.userRating || 0} readOnly size={18} />
                </div>

                <div className="flex gap-3 flex-1 justify-end relative mr-1">
                  {movie.imdbUrl && (
                    <a
                      href={movie.imdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 xl:flex-none bg-yellow-400 text-black px-4 py-1 text-lg font-bold hover:bg-white hover:text-black border-2 border-transparent transition-colors text-center"
                    >
                      IMDB
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};