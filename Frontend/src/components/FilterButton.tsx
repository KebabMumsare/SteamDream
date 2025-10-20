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
        className="rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center px-4 py-2 text-base md:px-[1vw] md:py-[0.5vw] md:text-[1vw]"
        style={{
          backgroundColor: colors.primaryBtn,
          gap: '0.5rem',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
      >
        <svg className="w-5 h-5 md:w-[1.5vw] md:h-[1.5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter
        {activeFilterCount > 0 && (
          <span className="bg-white text-gray-800 rounded-full font-bold ml-2 px-2 py-0.5 text-xs md:ml-[0.5vw] md:px-[0.5vw] md:py-[0.2vw] md:text-[1vw]">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Filter Content */}
          <div 
            className="filter-panel absolute top-full rounded-lg shadow-2xl z-50 max-h-[70vh] overflow-y-auto mt-2 right-0"
            style={{ 
              backgroundColor: colors.headerBg,
              width: '90vw',
              maxWidth: '500px',
            }}
          >
            <div className="p-6 md:p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 md:mb-3">
                <h3 className="font-bold text-white text-xl md:text-lg">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Reset All
                </button>
              </div>

              {/* Discount Filter */}
              <div className="mb-4 md:mb-3">
                <label className="block text-white font-semibold mb-2 text-base md:text-sm">
                  Discount Percentage
                </label>
                <div className="flex flex-col gap-3 md:gap-2">
                  <div className="flex items-center gap-3 md:gap-2">
                    <div className="flex-1">
                      <label className="text-white/70 text-sm md:text-xs">Min: {filters.discountMin}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.discountMin}
                        onChange={(e) => handleDiscountChange(Number(e.target.value), filters.discountMax)}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${filters.discountMin}%, #374151 ${filters.discountMin}%, #374151 100%)`
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white/70 text-sm md:text-xs">Max: {filters.discountMax}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.discountMax}
                        onChange={(e) => handleDiscountChange(filters.discountMin, Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${filters.discountMax}%, #374151 ${filters.discountMax}%, #374151 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4 md:mb-3">
                <label className="block text-white font-semibold mb-2 text-base md:text-sm">
                  Current Price (€)
                </label>
                <div className="flex flex-col gap-3 md:gap-2">
                  <div className="flex items-center gap-3 md:gap-2">
                    <div className="flex-1">
                      <label className="text-white/70 text-sm md:text-xs">Min: €{filters.priceMin}</label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={filters.priceMin}
                        onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceMax)}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${(filters.priceMin / 1000) * 100}%, #374151 ${(filters.priceMin / 1000) * 100}%, #374151 100%)`
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white/70 text-sm md:text-xs">Max: €{filters.priceMax}</label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={filters.priceMax}
                        onChange={(e) => handlePriceChange(filters.priceMin, Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${colors.primaryBtn} 0%, ${colors.primaryBtn} ${(filters.priceMax / 1000) * 100}%, #374151 ${(filters.priceMax / 1000) * 100}%, #374151 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-white font-semibold mb-2 text-base md:text-sm">
                  Genres / Tags ({filters.selectedGenres.length} selected)
                </label>
                <div className="overflow-y-auto bg-white/5 rounded-lg p-3 md:p-2 flex flex-col gap-2 md:gap-1 max-h-48 md:max-h-60">
                  {allGenres.length > 0 ? (
                    allGenres.map((genre) => (
                      <label
                        key={genre}
                        className="flex items-center cursor-pointer hover:bg-white/10 rounded transition-colors gap-3 md:gap-2 p-2 md:p-1.5"
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                          className="rounded cursor-pointer w-4 h-4"
                          style={{ accentColor: colors.primaryBtn }}
                        />
                        <span className="text-white text-sm md:text-xs">{genre}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-white/50 text-center text-sm md:text-xs p-3 md:p-2">No genres available</p>
                  )}
                </div>
              </div>

              {/* Active Filters Summary */}
              {activeFilterCount > 0 && (
                <div className="border-t border-white/20 mt-4 pt-3 md:mt-3 md:pt-2">
                  <p className="text-white/70 text-sm md:text-xs">
                    {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <style>{`
        @media (max-width: 500px) {
          .filter-panel {
            right: -30vw !important;
          }
        }
      `}</style>
    </div>
  );
}

export default FilterButton;
