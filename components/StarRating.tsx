import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  onRate, 
  readOnly = false,
  size = 24
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onRate && onRate(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(null)}
            className="focus:outline-none"
          >
            <Star
              size={size}
              className={`${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-transparent text-neutral-700'
              }`}
              strokeWidth={isFilled ? 0 : 2}
            />
          </button>
        );
      })}
    </div>
  );
};