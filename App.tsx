import React, { useState } from 'react';
import { Sparkles, Tv, Ticket, Search, Loader } from 'lucide-react';
import { AddMovieModal } from './components/AddMovieModal';
import { MovieCard } from './components/MovieCard';
import { WatchlistCard } from './components/WatchlistCard';
import { HoroscopeModal } from './components/HoroscopeModal';
import { BlogModal } from './components/BlogModal';

import { PatreonModal } from './components/PatreonModal';
import { MusicModal } from './components/MusicModal';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { SurpriseModal } from './components/SurpriseModal';
import { AdminPanel } from './components/AdminPanel';
import { AboutModal } from './components/AboutModal';
import { SuggestionModal } from './components/SuggestionModal';
import { MovieDetailModal } from './components/MovieDetailModal';
import { LoginModal } from './components/LoginModal';
import { BlogCard } from './components/BlogCard';
import { BlogDetailModal } from './components/BlogDetailModal';
import { BLOG_POSTS } from './services/blogData';
import { useMovieData } from './hooks/useMovieData';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useMovieFilter } from './hooks/useMovieFilter';
import { MovieEntry, MovieStatus, BlogEntry } from './types';

type ViewMode = 'watched' | 'watchlist' | 'admin' | 'blog';

export default function App() {
  // 1. Core Data Hook
  const {
    movies,
    activeTab, // This is data entry default status
    setActiveTab,
    addMovie,
    isSubmitting,
    deleteMovie,
    updateMovieStatus,
    approveMovie,
    addSuggestion,
    suggestions,
    deleteSuggestion,
    isLoading
  } = useMovieData();

  const [view, setView] = useState<ViewMode>('watched');

  // Filter approved movies for the main list
  const approvedMovies = movies.filter(m => m.isApproved !== false);
  const currentTabMovies = approvedMovies.filter(m => m.status === activeTab);

  // 2. Filter Hook (Only for approved movies in current tab)
  const {
    filters: hookFilters,
    setFilter: hookSetFilter,
    resetFilters: hookResetFilters,
    paginatedMovies: hookPaginatedMovies,
    filteredMovies: hookFilteredMovies,
    availableGenres: hookAvailableGenres,
    availableYears: hookAvailableYears,
    availableDirectors: hookAvailableDirectors,
    pagination: hookPagination,
    sortOption,
    setSortOption
  } = useMovieFilter(currentTabMovies);

  // 3. UI State
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoroscopeOpen, setIsHoroscopeOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);

  const [isPatreonOpen, setIsPatreonOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [surpriseMovie, setSurpriseMovie] = useState<MovieEntry | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieEntry | null>(null);

  // Blog State
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogEntry | null>(null);

  // Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Sync Data Tab with View (when not admin)
  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
    if (newView !== 'admin') {
      setActiveTab(newView);
    }
  };

  // Move to Watched State
  const [movingMovieId, setMovingMovieId] = useState<string | null>(null);
  const [movingMovieTitle, setMovingMovieTitle] = useState<string>('');

  // Handlers
  const handleMoveToWatched = (movie: MovieEntry) => {
    setMovingMovieId(movie.id);
    setMovingMovieTitle(movie.title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setMovingMovieId(null);
      setMovingMovieTitle('');
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (movingMovieId) {
        updateMovieStatus(movingMovieId, 'watched', {
          userRating: data.userRating,
          userReview: data.userReview,
          watchedDate: new Date().toISOString()
        });
      } else {
        await addMovie(data);
        alert('ISLEM BASARILI. YENI KAYIT ONAY SURECINE ALINDI.');
      }
      closeModal();
    } catch (e) {
      alert("Islem sirasinda bir hata telegrafi olustu.");
    }
  };

  const handleDeleteMovie = (id: string) => {
    const isWatchlist = activeTab === 'watchlist';
    const msg = isWatchlist
      ? 'BU FILMI SILMEK ISTEDIGINIZE EMIN MISINIZ?'
      : 'BU KAYDI SILMEK ISTEDIGINIZE EMIN MISINIZ?';

    if (window.confirm(msg)) {
      deleteMovie(id);
    }
  };

  const handleSurpriseMe = () => {
    // Surprise me should always pick from the WATCHED collection/pool
    const watchedMovies = approvedMovies.filter(m => m.status === 'watched' && (m.userRating || 0) >= 4);

    if (watchedMovies.length === 0) {
      alert("ŞANSINIZ YOKMUŞ! KOLEKSIYONDA 4 VEYA 5 YILDIZLI FILM BULUNAMADI.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * watchedMovies.length);
    setSurpriseMovie(watchedMovies[randomIndex]);
  };

  const handleDirectorSelect = (director: string) => {
    if (view === 'watched' && hookFilters.director === director) {
      hookSetFilter('director', '');
    } else {
      handleViewChange('watched');
      // Reset other filters
      hookSetFilter('searchTerm', '');
      hookSetFilter('genre', '');
      hookSetFilter('year', '');
      hookSetFilter('rating', '');
      hookSetFilter('director', director);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-black text-white font-mono selection:bg-yellow-400 selection:text-black">

      <Header
        activeTab={view}
        setActiveTab={handleViewChange as any} // Force cast for now, will update Header props next
        onSurpriseMe={handleSurpriseMe}
        isSearchVisible={isSearchVisible}
        toggleSearch={() => setIsSearchVisible(!isSearchVisible)}
        searchTerm={hookFilters.searchTerm}
        onSearchChange={(val) => hookSetFilter('searchTerm', val)}
        onHoroscopeClick={() => setIsHoroscopeOpen(true)}
        onBlogClick={() => handleViewChange('blog')}
        onMusicClick={() => setIsMusicOpen(true)}

        // Mobile Menu Props
        onPatreonClick={() => setIsPatreonOpen(true)}
        onAddMovieClick={() => setIsModalOpen(true)}
        onLoginClick={() => {
          if (isAdminLoggedIn) {
            handleViewChange(view === 'admin' ? 'watched' : 'admin');
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        onSuggestionClick={() => setIsSuggestionOpen(true)}
        onAboutClick={() => setIsAboutOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />


      <main className="max-w-[1800px] mx-auto px-4 py-6">

        {view === 'admin' && isAdminLoggedIn ? (
          <AdminPanel
            movies={movies}
            onApprove={async (id) => await approveMovie(id)}
            onDelete={async (id) => await deleteMovie(id)}
            onUpdate={async (id, data) => await updateMovieStatus(id, data.status!, data)}
            suggestions={suggestions}
            onDeleteSuggestion={deleteSuggestion}
          />
        ) : view === 'blog' ? (
          // BLOG VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {BLOG_POSTS.map(post => (
              <BlogCard
                key={post.id}
                post={post}
                onClick={setSelectedBlogPost}
              />
            ))}
          </div>
        ) : isLoading ? (
          // LOADING STATE
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <Loader className="w-16 h-16 text-yellow-400 animate-spin mb-4" />
            <h2 className="text-3xl text-white animate-pulse teletext-shadow">BULUT BAĞLANTISI KURULUYOR...</h2>
            <p className="text-neutral-500 mt-2 font-mono text-sm tracking-widest">SİNYAL ARANIYOR</p>
          </div>
        ) : (
          <>
            {currentTabMovies.length > 0 && (
              <FilterBar
                activeTab={view as MovieStatus}
                selectedGenre={hookFilters.genre}
                setSelectedGenre={(val) => hookSetFilter('genre', val)}
                selectedDirector={hookFilters.director}
                setSelectedDirector={(val) => hookSetFilter('director', val)}
                selectedYear={hookFilters.year}
                setSelectedYear={(val) => hookSetFilter('year', val)}
                selectedRating={hookFilters.rating}
                setSelectedRating={(val) => hookSetFilter('rating', val)}
                availableGenres={hookAvailableGenres}
                availableDirectors={hookAvailableDirectors}
                availableYears={hookAvailableYears}
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            )}

            {/* Movie Grid */}
            {currentTabMovies.length === 0 ? (
              <div className="border-4 border-white border-dashed p-12 text-center bg-neutral-900">
                <Tv size={64} className="mx-auto text-neutral-600 mb-4" />
                <h2 className="text-3xl text-yellow-400 mb-2">SINYAL YOK</h2>
                <p className="text-xl text-white">LÜTFEN YENİ KAYIT EKLEYİNİZ...</p>
                <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-yellow-400 text-black px-6 py-2 text-xl font-bold hover:bg-white">
                  [ KAYIT EKLE ]
                </button>
              </div>
            ) : hookFilteredMovies.length === 0 ? (
              <div className="bg-red-900/50 border-2 border-red-600 p-8 text-center">
                <p className="text-2xl text-red-400 blink">ARAMA SONUCU BULUNAMADI</p>
                <button onClick={hookResetFilters} className="mt-4 text-white underline decoration-2 underline-offset-4 hover:text-yellow-400">FILTRELERI SIFIRLA</button>
              </div>
            ) : (
              <>
                {view === 'watchlist' ? (
                  // Watchlist Grid (Compact)
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {hookPaginatedMovies.map(movie => (
                      <WatchlistCard
                        key={movie.id}
                        movie={movie}
                      />
                    ))}
                  </div>
                ) : (
                  // Watched Grid (Detailed)
                  // Watched Grid (Detailed -> Compact)
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {hookPaginatedMovies.map(movie => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onDelete={handleDeleteMovie}
                        onMoveToWatched={handleMoveToWatched}
                        onDirectorClick={handleDirectorSelect}
                        onClick={setSelectedMovie}
                        className="h-full"
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {hookPagination.totalPages > 1 && (
                  <div className="flex justify-between items-center bg-neutral-900 border-2 border-white p-4 mt-8 font-bold text-xl select-none">
                    <button
                      onClick={hookPagination.goToPrevPage}
                      disabled={hookPagination.currentPage === 1}
                      className={`transition-colors ${hookPagination.currentPage === 1 ? 'text-neutral-700 cursor-not-allowed' : 'text-white hover:text-yellow-400 hover:bg-neutral-800 px-4'}`}
                    >
                      &lt; ÖNCEKİ
                    </button>

                    <div className="text-yellow-400 font-mono text-2xl">
                      SAYFA [ 100-{hookPagination.currentPage.toString().padStart(2, '0')} ]
                    </div>

                    <button
                      onClick={hookPagination.goToNextPage}
                      disabled={hookPagination.currentPage === hookPagination.totalPages}
                      className={`transition-colors ${hookPagination.currentPage === hookPagination.totalPages ? 'text-neutral-700 cursor-not-allowed' : 'text-white hover:text-yellow-400 hover:bg-neutral-800 px-4'}`}
                    >
                      SONRAKİ &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      {/* Bottom Search Bar */}
      {isSearchVisible && (
        <div className="fixed bottom-[73px] sm:bottom-[77px] left-0 w-full bg-blue-800 p-2 border-y-2 border-white flex items-center gap-2 z-50 animate-in slide-in-from-bottom duration-200 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <span className="text-white font-bold whitespace-nowrap px-2">ARAMA &gt;</span>
          <input
            autoFocus
            type="text"
            value={hookFilters.searchTerm}
            onChange={(e) => hookSetFilter('searchTerm', e.target.value.toUpperCase())}
            placeholder="FİLM VEYA YÖNETMEN ARA..."
            className="w-full bg-black text-yellow-400 p-2 text-xl font-bold border-none outline-none placeholder-neutral-700"
          />
          <button
            onClick={() => setIsSearchVisible(false)}
            className="bg-red-600 text-white px-3 py-1 font-bold hover:bg-red-500 whitespace-nowrap"
          >
            KAPAT
          </button>
        </div>
      )}

      {/* Footer - Split Buttons */}
      <footer className="fixed bottom-0 left-0 w-full bg-black border-t-2 border-white p-2 z-40 hidden md:grid grid-cols-2 gap-2">
        {/* Left Half: Bir Film Ismarla */}
        <button
          onClick={() => setIsPatreonOpen(true)}
          className="w-full bg-cyan-400 text-black font-bold text-lg sm:text-2xl py-3 border-2 border-transparent hover:border-white hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2"
        >
          <Ticket className="w-6 h-6 sm:w-8 sm:h-8" />
          <span>[ BİR FİLM ISMARLA ]</span>
        </button>

        {/* Right Half: Other Actions */}
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-yellow-400 text-black font-bold text-lg sm:text-2xl py-3 border-2 border-transparent hover:border-white hover:bg-yellow-300 transition-colors"
          >
            [ + YENİ KAYIT ]
          </button>
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="bg-neutral-800 text-neutral-500 font-bold text-lg px-4 border-2 border-transparent hover:border-white hover:text-white transition-colors flex items-center justify-center"
            title="ARAMA"
          >
            <Search className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              if (isAdminLoggedIn) {
                handleViewChange(view === 'admin' ? 'watched' : 'admin');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className={`bg-neutral-800 text-neutral-500 font-bold text-lg px-4 border-2 border-transparent hover:border-white hover:text-white transition-colors flex items-center justify-center ${view === 'admin' ? 'bg-red-900/50 text-white border-red-500' : ''}`}
            title={isAdminLoggedIn ? "YONETIM PANELI (AKTIF)" : "YONETICI GIRISI"}
          >
            {isAdminLoggedIn ? (view === 'admin' ? 'ÇIKIŞ' : 'ADMİN') : 'GİRİŞ'}
          </button>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="bg-neutral-800 text-neutral-500 font-bold text-lg px-4 border-2 border-transparent hover:border-white hover:text-white transition-colors flex items-center justify-center"
          >
            ?
          </button>
          <button
            onClick={() => setIsSuggestionOpen(true)}
            className="bg-neutral-800 text-neutral-500 font-bold text-lg px-4 border-2 border-transparent hover:border-white hover:text-white transition-colors flex items-center justify-center"
            title="ONERI FORMU"
          >
            ÖF
          </button>
        </div>
      </footer>

      <AddMovieModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialTitle={movingMovieTitle}
      />

      <HoroscopeModal
        isOpen={isHoroscopeOpen}
        onClose={() => setIsHoroscopeOpen(false)}
        movies={approvedMovies.filter(m => m.status === 'watched' && (m.userRating || 0) >= 4)} // Only 4-5 star watched movies
      />

      <BlogModal
        isOpen={isBlogOpen}
        onClose={() => setIsBlogOpen(false)}
      />

      <PatreonModal
        isOpen={isPatreonOpen}
        onClose={() => setIsPatreonOpen(false)}
      />

      <MusicModal
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
      />

      <SurpriseModal
        movie={surpriseMovie}
        onClose={() => setSurpriseMovie(null)}
        onTryAgain={handleSurpriseMe}
        onDelete={handleDeleteMovie}
        onMoveToWatched={handleMoveToWatched}
        onDirectorClick={handleDirectorSelect}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        watchedCount={approvedMovies.filter(m => m.status === 'watched').length}
        watchlistCount={approvedMovies.filter(m => m.status === 'watchlist').length}
      />

      <SuggestionModal
        isOpen={isSuggestionOpen}
        onClose={() => setIsSuggestionOpen(false)}
        onSubmit={addSuggestion}
        isSubmitting={isSubmitting}
      />

      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onDelete={(id) => {
          handleDeleteMovie(id);
          setSelectedMovie(null);
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => handleViewChange('admin')}
      />

      <BlogDetailModal
        post={selectedBlogPost}
        onClose={() => setSelectedBlogPost(null)}
      />

    </div>
  );
}