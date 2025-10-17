import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Card from './components/Card';
import Navbar from './components/Navbar';
import Profile from './Profile';
import Login from './Login';
import Favorite from './Favorite';
import FilterButton from './components/FilterButton';
import type { FilterState } from './components/FilterButton';
import { useEffect, useState } from 'react';
import { getAllGames } from './service/steamApi';

interface Game {
  appid: number;
  name: string;
  price_before_discount?: number;
  price_after_discount?: number;
  discount_percent?: number;
  image_url?: string;
  platforms?: any;
  tags?: string[];
  categories?: string[];
  description?: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    discountMin: 0,
    discountMax: 100,
    priceMin: 0,
    priceMax: 1000,
    selectedGenres: [],
  });

  const [colors, setColors] = useState({
    background: '#1B2838',
    drawerBg: '#1B2838',
    primaryBtn: '#66C0F4',
    primaryBtnHover: '#2979A8',
    ownedGamesHeader: '#004E7B',
    overlayBg: 'rgba(0, 0, 0, 0.4)',
    headerBg: '#004E7B',
  });

  const swapColors = () => {
    const variants = [
      {ownedGamesHeader: `#66007B`, background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#D866F4', primaryBtnHover: '#8A3F9C', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#66007B'},
      {ownedGamesHeader: `#6E6D6E`, background: '#434343', drawerBg: '#434343', primaryBtn: '#B4ADB6', primaryBtnHover: '#747175', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#6E6D6E'},
      {ownedGamesHeader: `#F6965B`, background: '#B95223', drawerBg: '#B95223', primaryBtn: '#F47246', primaryBtnHover: '#9B2913', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#F6965B'},
      {ownedGamesHeader: `#76E391`, background: '#22551F', drawerBg: '#22551F', primaryBtn: '#76E391', primaryBtnHover: '#2BAE2D', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},
      {background: '#1B2838', drawerBg: '#1B2838', primaryBtn: '#66C0F4', primaryBtnHover: '#2979A8', ownedGamesHeader: '#004E7B', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#004E7B'},
      {ownedGamesHeader: `#2A16FF`, background: '#EAFF03', drawerBg: '#800079', primaryBtn: '#FF7301', primaryBtnHover: '#2A16FF', overlayBg: 'rgba(0, 0, 0, 0.4)', headerBg: '#76E391'},
    ];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setColors(randomVariant);
    document.documentElement.style.setProperty('--body-bg', randomVariant.headerBg);
  };

  const [font, setFont] = useState({font: 'font-mono'});

  const swapFont = () => {
    const fonts = ["font-mono", "font-sans", "font-serif"];
    const randomfonts = fonts[Math.floor(Math.random() * fonts.length)];
    setFont({font: randomfonts});
  };

  // Fetch games from database
  useEffect(() => {
    async function fetchGames() {
      try {
        console.log('🎮 Fetching games from database...');
        setLoading(true);
        const data = await getAllGames(100, 0);
        console.log('✅ Games fetched:', data);
        setGames(data.games || []);
      } catch (error) {
        console.error('❌ Failed to fetch games:', error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGames();
  }, []);

  return (
    <BrowserRouter>
      <div className={font.font}>
        <Navbar colors={colors} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="max-w-[90%] mx-auto">
                <div className='z-49 pt-0 pb-[3vw] w-[90vw] fixed top-0 left-0 right-0 mx-auto' style={{ background: `linear-gradient(to bottom, ${colors.headerBg} 0%, ${colors.headerBg} 70%, rgba(0,78,123,0) 100%)`, paddingTop: '10vw' }}>
                  <div className="relative flex justify-center items-center">
                    <h1
                      className="text-white font-bold underline text-center"
                      style={{ fontSize: "1.9vw" }}
                    >
                      SteamDream
                    </h1>
                    {/* Filter button positioned absolutely on the right */}
                    <div className="absolute right-8">
                      <FilterButton 
                        games={games}
                        onFilterChange={setFilters}
                        colors={colors}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-[18vw] space-y-12">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#66C0F4] border-t-transparent"></div>
                      <p className="text-white/70 mt-4">Loading games...</p>
                    </div>
                  ) : games.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-white/70">No games found in database.</p>
                    </div>
                  ) : (
                    games
                      .filter(game => {
                        // Search filter
                        if (!game.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
                          return false;
                        }

                        // Discount and Price filters combined
                        const discount = game.discount_percent || 0;
                        const price = game.price_after_discount || game.price_before_discount || 0;
                        
                        if (discount < filters.discountMin || discount > filters.discountMax ||
                            price < filters.priceMin || price > filters.priceMax) {
                          return false;
                        }

                        // Genre filter
                        if (filters.selectedGenres.length > 0) {
                          const gameTags = game.tags || [];
                          if (!filters.selectedGenres.some(genre => gameTags.includes(genre))) {
                            return false;
                          }
                        }

                        return true;
                      })
                      .map((game) => (
                        <Card 
                          imageUrl={game.image_url}
                          key={game.appid}
                          title={game.name}
                          genre={game.categories?.slice(0, 2).join(' & ') || ''}
                          originalPrice={game.price_before_discount}
                          currentPrice={game.price_after_discount}
                          discountPercent={game.discount_percent}
                          platforms={game.platforms || {}}
                          tags={game.tags || []}
                          description={game.description || ''}
                          steamUrl={`https://store.steampowered.com/app/${game.appid}`}
                          colors={{
                            background: colors.background,
                            primaryBtn: colors.primaryBtn,
                            primaryBtnHover: colors.primaryBtnHover
                          }}
                        />
                      ))
                  )}
                </div>
              </div>
            </>
          }
        />
        <Route path="/profile" element={<Profile colors={colors} swapColors={swapColors} swapFont={swapFont} />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/favorite" element={<Favorite colors={colors} searchTerm={searchTerm} />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
