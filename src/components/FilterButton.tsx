import { useState } from 'react';

interface FilterProps {
  games: any[];
  onFilterChange: (filters: FilterState) => void;
  colors: {
    primaryBtn: string;
    primaryBtnHover: string;
    headerBg: string;
  };
}

export interface FilterState {
  discountMin: number;
  discountMax: number;
  priceMin: number;
  priceMax: number;
  selectedGenres: string[];
}

function FilterButton({ games, onFilterChange, colors }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    discountMin: 0,
    discountMax: 100,
    priceMin: 0,
    priceMax: 1000,
    selectedGenres: [],
  });

  // Extract unique genres from games
  const allGenres = Array.from(
    new Set(
      games.flatMap(game => game.tags || [])
    )
  ).sort();

  const toggleGenre = (genre: string) => {
    const newGenres = filters.selectedGenres.includes(genre)
      ? filters.selectedGenres.filter(g => g !== genre)
      : [...filters.selectedGenres, genre];
    
    const newFilters = { ...filters, selectedGenres: newGenres };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDiscountChange = (min: number, max: number) => {
    const newFilters = { ...filters, discountMin: min, discountMax: max };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (min: number, max: number) => {
    const newFilters = { ...filters, priceMin: min, priceMax: max };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const newFilters = {
      discountMin: 0,
      discountMax: 100,
      priceMin: 0,
      priceMax: 1000,
      selectedGenres: [],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = 
    (filters.discountMin > 0 ? 1 : 0) +
    (filters.discountMax < 100 ? 1 : 0) +
    (filters.priceMin > 0 ? 1 : 0) +
    (filters.priceMax < 1000 ? 1 : 0) +
    filters.selectedGenres.length;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        style={{
          backgroundColor: colors.primaryBtn,
          gap: '0.5vw',
          paddingLeft: '1vw',
          paddingRight: '1vw',
          paddingTop: '0.5vw',
          paddingBottom: '0.5vw',
          fontSize: '1vw'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5vw', height: '1.5vw' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter
        {activeFilterCount > 0 && (
          <span className="bg-white text-gray-800 rounded-full font-bold" style={{ marginLeft: '0.5vw', paddingLeft: '0.5vw', paddingRight: '0.5vw', paddingTop: '0.1vw', paddingBottom: '0.1vw', fontSize: '0.8vw' }}>
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Filter Content */}
          <div 
            className="filter-panel absolute top-full shadow-2xl z-[70] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: '#1B5A7E',
              width: '30vw',
              maxHeight: '70vh',
              marginTop: '0.5vw',
              border: '3px solid rgba(102, 192, 244, 0.5)',
              right: '0',
              minWidth: '20vw',
              borderRadius: '0.5vw'
            }}
          >
            <div style={{ padding: '2vw' }}>
              {/* Header */}
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5vw' }}>
                <h3 className="font-bold text-white" style={{ fontSize: '1.5vw' }}>Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-white hover:text-white/80 transition-colors"
                  style={{ 
                    fontSize: '0.9vw',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.5vw 1vw',
                    borderRadius: '0.5vw'
                  }}
                >
                  Reset All
                </button>
              </div>

              {/* Discount Filter */}
              <div style={{ marginBottom: '1.5vw' }}>
                <label className="block text-white font-semibold" style={{ marginBottom: '1vw', fontSize: '1vw' }}>
                  Discount Percentage
                </label>
                <div className="flex items-center justify-between" style={{ gap: '1vw', marginBottom: '0.5vw' }}>
                  <span className="text-white/70" style={{ fontSize: '0.9vw' }}>Min: {filters.discountMin}%</span>
                  <span className="text-white/70" style={{ fontSize: '0.9vw' }}>Max: {filters.discountMax}%</span>
                </div>
                <div className="flex items-center" style={{ gap: '1vw' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.discountMin}
                    onChange={(e) => handleDiscountChange(Number(e.target.value), filters.discountMax)}
                    className="flex-1 h-2 appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${filters.discountMin}%, rgba(255,255,255,0.2) ${filters.discountMin}%, rgba(255,255,255,0.2) 100%)`,
                      borderRadius: '0.5vw'
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.discountMax}
                    onChange={(e) => handleDiscountChange(filters.discountMin, Number(e.target.value))}
                    className="flex-1 h-2 appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${filters.discountMax}%, rgba(255,255,255,0.2) ${filters.discountMax}%, rgba(255,255,255,0.2) 100%)`,
                      borderRadius: '0.5vw'
                    }}
                  />
                </div>
              </div>

              {/* Price Filter */}
              <div style={{ marginBottom: '1.5vw' }}>
                <label className="block text-white font-semibold" style={{ marginBottom: '1vw', fontSize: '1vw' }}>
                  Current Price (€)
                </label>
                <div className="flex items-center justify-between" style={{ gap: '1vw', marginBottom: '0.5vw' }}>
                  <span className="text-white/70" style={{ fontSize: '0.9vw' }}>Min: €{filters.priceMin}</span>
                  <span className="text-white/70" style={{ fontSize: '0.9vw' }}>Max: €{filters.priceMax}</span>
                </div>
                <div className="flex items-center" style={{ gap: '1vw' }}>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.priceMin}
                    onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceMax)}
                    className="flex-1 h-2 appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${(filters.priceMin / 1000) * 100}%, rgba(255,255,255,0.2) ${(filters.priceMin / 1000) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      borderRadius: '0.5vw'
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.priceMax}
                    onChange={(e) => handlePriceChange(filters.priceMin, Number(e.target.value))}
                    className="flex-1 h-2 appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${(filters.priceMax / 1000) * 100}%, rgba(255,255,255,0.2) ${(filters.priceMax / 1000) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      borderRadius: '0.5vw'
                    }}
                  />
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-white font-semibold" style={{ marginBottom: '1vw', fontSize: '1vw' }}>
                  Genres / Tags ({filters.selectedGenres.length} selected)
                </label>
                <div className="overflow-y-auto flex flex-col" style={{ padding: '1vw', gap: '0.5vw', maxHeight: '15vw', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '0.5vw' }}>
                  {allGenres.length > 0 ? (
                    allGenres.map((genre) => (
                      <label
                        key={genre}
                        className="flex items-center cursor-pointer hover:bg-white/10 transition-colors"
                        style={{ gap: '0.8vw', padding: '0.5vw', borderRadius: '0.3vw' }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                          className="rounded cursor-pointer"
                          style={{ accentColor: colors.primaryBtn, width: '1vw', height: '1vw' }}
                        />
                        <span className="text-white" style={{ fontSize: '0.9vw' }}>{genre}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-white/50 text-center" style={{ padding: '1vw', fontSize: '0.9vw' }}>No genres available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FilterButton;
