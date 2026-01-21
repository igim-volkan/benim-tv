import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { StarRating } from './StarRating';
import { AddMovieFormData, MovieStatus, MovieEntry } from '../types';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddMovieFormData) => Promise<void>;
  isSubmitting: boolean;
  initialTitle?: string;
  editMovie?: MovieEntry;
}

// Common genres for manual selection
const GENRES = [
  "Aksiyon", "Bilim Kurgu", "Drama", "Komedi", "Korku",
  "Macera", "Romantik", "Gerilim", "Animasyon", "Belgesel",
  "Fantastik", "Suc", "Gizem", "Savas", "Western"
];

export const AddMovieModal: React.FC<AddMovieModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialTitle = '',
  editMovie
}) => {
  const [mode, setMode] = useState<MovieStatus>('watched');
  const [title, setTitle] = useState('');
  const [imdbLink, setImdbLink] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [manualYear, setManualYear] = useState('');
  const [manualDirector, setManualDirector] = useState('');
  const [manualGenres, setManualGenres] = useState<string[]>([]);
  const [manualSummary, setManualSummary] = useState('');
  const [error, setError] = useState('');

  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editMovie) {
        // Edit Mode
        setTitle(editMovie.title);
        setImdbLink(editMovie.imdbUrl || '');
        setPosterPreview(editMovie.posterBase64 || null);
        setMode(editMovie.status);
        setRating(editMovie.userRating || 0);
        setReview(editMovie.userReview || '');
        setManualYear(editMovie.year !== '???' ? editMovie.year : '');
        setManualDirector(editMovie.director !== 'Bilinmiyor' ? editMovie.director : '');
        setManualGenres(editMovie.genre && editMovie.genre[0] !== 'Bilinmiyor' ? editMovie.genre : []);
        setManualSummary(editMovie.summary !== 'Özet bulunamadı.' ? editMovie.summary : '');
      } else {
        // Create Mode
        setTitle(initialTitle);
        setImdbLink('');
        setPosterPreview(null);
        if (initialTitle) {
          setMode('watched');
        } else {
          setMode('watched');
        }
        setRating(0);
        setReview('');
        setManualYear('');
        setManualDirector('');
        setManualGenres([]);
        setManualSummary('');
      }
      setError('');
    }
  }, [isOpen, initialTitle, editMovie]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("DOSYA COK BUYUK (MAX 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPosterPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('FILM ADI GIRINIZ');
      return;
    }

    if (mode === 'watched' && rating === 0) {
      setError('PUAN VERINIZ');
      return;
    }

    await onSubmit({
      rawTitle: title,
      status: mode,
      userRating: mode === 'watched' ? rating : undefined,
      userReview: mode === 'watched' ? review : undefined,
      imdbUrl: imdbLink.trim() || undefined,
      manualPosterBase64: posterPreview || undefined,
      manualYear: manualYear.trim() || undefined,
      manualDirector: manualDirector.trim() || undefined,
      manualGenres: manualGenres.length > 0 ? manualGenres : undefined,
      manualSummary: manualSummary.trim() || undefined
    });

    if (!initialTitle && !editMovie) {
      setTitle('');
      setImdbLink('');
      setPosterPreview(null);
      setRating(0);
      setReview('');
      setManualYear('');
      setManualDirector('');
      setManualGenres([]);
      setManualSummary('');
    }
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-black border-4 border-white w-full max-w-lg shadow-[20px_20px_0px_#222] relative max-h-[90vh] overflow-y-auto">

        {/* Header Bar */}
        <div className="bg-white text-black px-4 py-2 flex justify-between items-center font-bold text-xl sticky top-0 z-10">
          <span>{editMovie ? '> KAYIT DUZENLE' : (initialTitle ? '> PUANLAMA EKRANI' : '> YENİ KAYIT EKLE')}</span>
          <button onClick={onClose} disabled={isSubmitting} className="hover:bg-red-600 hover:text-white px-2">
            [ÇIKIŞ]
          </button>
        </div>

        {/* Tab Switcher */}
        {!initialTitle && !editMovie && (
          <div className="flex border-b-4 border-white">
            <button
              type="button"
              onClick={() => setMode('watched')}
              className={`flex-1 py-2 text-xl font-bold ${mode === 'watched' ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-500'}`}
            >
              İZLEDİM [+]
            </button>
            <button
              type="button"
              onClick={() => setMode('watchlist')}
              className={`flex-1 py-2 text-xl font-bold ${mode === 'watchlist' ? 'bg-green-600 text-white' : 'bg-neutral-900 text-neutral-500'}`}
            >
              İZLEYECEĞİM [+]
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="flex gap-4">
            {/* Poster Upload Area */}
            <div className="w-1/3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-[2/3] border-4 border-dashed ${posterPreview ? 'border-white' : 'border-neutral-700 hover:border-yellow-400'} flex flex-col items-center justify-center cursor-pointer bg-neutral-900`}
              >
                {posterPreview ? (
                  <img src={posterPreview} alt="Preview" className="w-full h-full object-cover grayscale contrast-125" />
                ) : (
                  <div className="text-center text-neutral-500 p-2">
                    <ImageIcon className="mx-auto mb-2" />
                    <span className="text-sm font-bold">FOTO YUKLE</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
              {posterPreview && (
                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }} className="w-full bg-red-600 text-white text-sm font-bold mt-2">SIL</button>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-yellow-400 font-bold mb-1">FILM ADI:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.toUpperCase())}
                  className="w-full bg-neutral-900 border-b-4 border-white text-white p-2 text-xl font-bold outline-none focus:bg-neutral-800 focus:border-yellow-400"
                  placeholder="ISIM GIRINIZ..."
                  autoFocus
                  disabled={isSubmitting || !!initialTitle}
                />
              </div>

              {/* Director Input */}
              {mode === 'watched' && (
                <div>
                  <label className="block text-orange-400 font-bold mb-1">YONETMEN:</label>
                  <input
                    type="text"
                    value={manualDirector}
                    onChange={(e) => setManualDirector(e.target.value)}
                    className="w-full bg-neutral-900 border-b-4 border-white text-white p-2 text-lg font-bold outline-none focus:bg-neutral-800 focus:border-orange-400"
                    placeholder="YONETMEN ADI..."
                    disabled={isSubmitting || !!initialTitle}
                  />
                </div>
              )}

              <div>
                <label className="block text-cyan-400 font-bold mb-1">IMDB LINK:</label>
                <input
                  type="url"
                  value={imdbLink}
                  onChange={(e) => setImdbLink(e.target.value)}
                  className="w-full bg-neutral-900 border-b-4 border-white text-white p-2 text-lg font-bold outline-none focus:bg-neutral-800 focus:border-cyan-400"
                  placeholder="HTTPS://..."
                  disabled={isSubmitting || !!initialTitle}
                />
              </div>

              {/* Genre Selection Dropdown */}
              {mode === 'watched' && (
                <div>
                  <label className="block text-pink-500 font-bold mb-1">TUR SEÇİMİ:</label>
                  <select
                    value={manualGenres[0] || ''}
                    onChange={(e) => setManualGenres(e.target.value ? [e.target.value] : [])}
                    className="w-full bg-neutral-900 border-b-4 border-white text-white p-2 text-lg font-bold outline-none focus:bg-neutral-800 focus:border-pink-500 appearance-none"
                  >
                    <option value="">TUR SECINIZ...</option>
                    {GENRES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Yil ve Puanlama */}
              {mode === 'watched' && (
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-white font-bold mb-1">YIL:</label>
                    <input
                      type="text"
                      value={manualYear}
                      onChange={(e) => setManualYear(e.target.value)}
                      className="w-full bg-neutral-900 border-b-4 border-white text-white p-2 text-lg font-bold outline-none focus:bg-neutral-800 focus:border-white"
                      placeholder="2024"
                      disabled={isSubmitting || !!initialTitle}
                    />
                  </div>
                  <div>
                    <label className="block text-green-400 font-bold mb-1">PUANLAMA:</label>
                    <div className="bg-neutral-900 p-2 border-2 border-green-600 flex justify-center">
                      <StarRating rating={rating} onRate={setRating} size={18} readOnly={isSubmitting} />
                    </div>
                  </div>
                </div>
              )}

              {/* DETAY / OZET */}
              {mode === 'watched' && (
                <div>
                  <label className="block text-purple-400 font-bold mb-1">DETAY / ÖZET:</label>
                  <textarea
                    value={manualSummary}
                    onChange={(e) => setManualSummary(e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-900 border-2 border-white text-white p-2 font-bold outline-none focus:border-purple-400 resize-none"
                    placeholder="AI YERINE MANUEL OZET..."
                    disabled={isSubmitting || !!initialTitle}
                  />
                </div>
              )}

              {/* YORUMUNUZ */}
              {mode === 'watched' && (
                <div>
                  <label className="block text-fuchsia-500 font-bold mb-1">YORUMUNUZ:</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value.toUpperCase())}
                    rows={3}
                    className="w-full bg-neutral-900 border-2 border-white text-white p-2 font-bold outline-none focus:border-fuchsia-500 resize-none"
                    placeholder="..."
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-2 font-bold blink text-center">
              *** {error} ***
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-2 border-white text-white font-bold py-3 hover:bg-white hover:text-black"
            >
              İPTAL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 font-bold py-3 text-white border-2 border-white ${isSubmitting ? 'bg-neutral-700' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}
            >
              {isSubmitting ? 'BEKLEYINIZ...' : (editMovie ? 'GUNCELLE' : 'KAYDET')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};