
export interface MovieMetadata {
  title: string;
  originalTitle: string;
  year: string;
  genre: string[];
  director: string;
  summary: string;
  emoji: string; // A fun emoji representing the movie
  themeColor: string; // A hex code suggested for the card border/accent
  posterBase64?: string; // Base64 string of the generated poster
  imdbUrl?: string; // Link to IMDb page
}

export type MovieStatus = 'watched' | 'watchlist';

export interface MovieEntry extends MovieMetadata {
  id: string;
  status: MovieStatus;
  userRating?: number; // Optional for watchlist
  userReview?: string; // Optional for watchlist
  watchedDate?: string; // Optional for watchlist
  isApproved?: boolean;
  createdAt?: string;
}

export interface AddMovieFormData {
  rawTitle: string;
  status: MovieStatus;
  userRating?: number;
  userReview?: string;
  imdbUrl?: string;
  manualPosterBase64?: string;
  manualYear?: string;
  manualDirector?: string;
  manualGenres?: string[];
  manualSummary?: string;
  isApproved?: boolean;
}

export interface SuggestionEntry {
  id: string;
  name: string;
  surname: string;
  message: string;
  createdAt: string;
}

export interface BlogEntry {
  id: string;
  title: string;
  summary: string;
  content: string; // HTML or Markdown string
  author: string;
  date: string;
  readTime: string;
  coverImage?: string; // Optional URL/Base64
  order?: number;
}
