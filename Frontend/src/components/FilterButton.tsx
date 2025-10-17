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
        className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        style={{
          backgroundColor: colors.primaryBtn,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtnHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primaryBtn}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter
        {activeFilterCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-white text-gray-800 rounded-full text-xs font-bold">
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
            className="absolute top-full mt-2 right-0 w-[400px] rounded-lg shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
            style={{ backgroundColor: colors.headerBg }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Discount Filter */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  Discount Percentage
                </label>
                <div className="space-y-3">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <label className="text-white/70 text-sm">Min: {filters.discountMin}%</label>
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
                      <label className="text-white/70 text-sm">Max: {filters.discountMax}%</label>
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
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  Current Price (€)
                </label>
                <div className="space-y-3">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <label className="text-white/70 text-sm">Min: €{filters.priceMin}</label>
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
                      <label className="text-white/70 text-sm">Max: €{filters.priceMax}</label>
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
                <label className="block text-white font-semibold mb-3">
                  Genres / Tags ({filters.selectedGenres.length} selected)
                </label>
                <div className="max-h-[200px] overflow-y-auto space-y-2 bg-white/5 rounded-lg p-3">
                  {allGenres.length > 0 ? (
                    allGenres.map((genre) => (
                      <label
                        key={genre}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedGenres.includes(genre)}
                          onChange={() => toggleGenre(genre)}
                          className="w-4 h-4 rounded cursor-pointer"
                          style={{ accentColor: colors.primaryBtn }}
                        />
                        <span className="text-white text-sm">{genre}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-white/50 text-sm text-center py-4">No genres available</p>
                  )}
                </div>
              </div>

              {/* Active Filters Summary */}
              {activeFilterCount > 0 && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-white/70 text-sm">
                    {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FilterButton;
